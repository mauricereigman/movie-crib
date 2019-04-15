import {HttpService, Injectable} from '@nestjs/common';
import {
	BehaviorSubject, concat,
	ErrorObserver,
	forkJoin, merge,
	Observable,
	of,
	onErrorResumeNext,
	Subject,
	throwError,
	timer
} from 'rxjs';
import {
	catchError, concatMap, debounce,
	delay,
	delayWhen,
	filter,
	map,
	retry,
	retryWhen,
	switchMap,
	take,
	takeUntil,
	tap, throttle, toArray
} from 'rxjs/operators';
import {ITvMazeShow} from './tv-maze-show.interface';
import {ITvMazeCastMember, ITvMazeCastMemberResponse} from './tv-maze-cast-member.interface';
import {TvMazeShowWithCastMember} from './tv-maze-show-with-cast-member.model';
import {TvMazeCastMember} from './tv-maze-cast-member.model';
import {TvMazeShow} from './tv-maze-show.model';
import {rejects} from 'assert';
import {arrayOfSize} from '../../utils/array-of-size';
import * as _ from 'lodash';

@Injectable()
export class TvMazeService {
	private static readonly api = 'http://api.tvmaze.com/shows';

	public static readonly maxSimultaneousShowRequests = 1;
	public showRequestQueueSubject = new BehaviorSubject<Observable<TvMazeShowWithCastMember[]>[]>([]);
	private readonly showRequestsStream = new Subject<TvMazeShowWithCastMember[]>();

	// public static readonly maxSimultaneousCastMemberRequests = 10;
	// public castMemberRequestQueue = new BehaviorSubject<Observable<TvMazeCastMember[]>[]>([]);
	// private readonly castMemberRequestsStream = new Subject<TvMazeCastMember[]>();

	constructor(private readonly http: HttpService) {
		this.handleRequestStream(this.showRequestQueueSubject, this.showRequestsStream, 'shows', TvMazeService.maxSimultaneousShowRequests);
	}

	public showsStream$(amountOfPages: number): Observable<TvMazeShowWithCastMember[]> {
		arrayOfSize(amountOfPages)
			.forEach(async pageNumber => {
				const request$ = this.http.get<ITvMazeShow[]>(`${TvMazeService.api}?page=${pageNumber}`)
					.pipe(
						take(1),
						map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeShow)),
						tap(_ => console.log(`retrieved ${_.length} shows`)),
						switchMap(shows => shows.map(show => this.castMembers(show.id)
							.pipe(map(castMembers => new TvMazeShowWithCastMember(show.id, show.name, castMembers))))
						),
						concatMap(TvMazeShowWithCastMembers => TvMazeShowWithCastMembers),
						toArray(),
						catchError(error => TvMazeService.handleError(error, pageNumber, 'shows')),
					);
				this.showRequestQueueSubject.next([...this.showRequestQueueSubject.getValue(), request$]);
			});
		return this.showRequestsStream
			.pipe(take(amountOfPages))
	}

	public castMembers(showId: number = 1): Observable<TvMazeCastMember[]> {
		return this.http.get<ITvMazeCastMemberResponse[]>(`${TvMazeService.api}/${showId}/cast`)
			.pipe(
				take(1),
				map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeCastMember)),
				tap(_ => console.log(`retrieved ${_.length} castMembers`,)),
				catchError(error => TvMazeService.handleError(error, showId, 'castmembers')),
			);
	}

	private static createTvMazeCastMember(castMember: ITvMazeCastMemberResponse) {
		return new TvMazeCastMember(castMember.person.id, castMember.person.birthday, castMember.person.name);
	}

	private static createTvMazeShow(tvMazeShow: ITvMazeShow): TvMazeShow {
		return new TvMazeShow(tvMazeShow.id, tvMazeShow.name);
	}

	private static handleError(error: any, key: number, context: 'castmembers' | 'shows'): Observable<never> {
		switch (context) {
			case 'castmembers':
				return throwError(`error occured while importing data for ${context} request for show with id: ${key}, originalError: ${error}`);
			case 'shows':
				return throwError(`error occured while importing data for ${context} request with pagenumber: ${key}, originalError: ${error}`);
		}
	}

	private handleRequestStream(queueSubject: BehaviorSubject<Observable<any>[]>, requestStream: Subject<any>, name: string, maxSimultaneousRequests: number): void {
		queueSubject
			.pipe(
				tap(test => console.log(test.length)),
				tap(queuedRequests => {
						console.log("doing: ", name, queuedRequests);
						const queuedRequestsCopy = [...queuedRequests];
						console.log("queuedRequestsCopy next", queuedRequestsCopy.length);
						const [first, ...rest] = queuedRequestsCopy;
						if( queuedRequests.length <= maxSimultaneousRequests) {
							first && first.pipe(
								tap(response => requestStream.next(response)),
								tap(() => queueSubject.next(queuedRequestsCopy))
							).subscribe()
						}
					}
				),
			)
			.subscribe()
	}
}
