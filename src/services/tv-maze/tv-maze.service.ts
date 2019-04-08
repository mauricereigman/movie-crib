import { HttpService, Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, retry, switchMap, take, tap } from 'rxjs/operators';
import { ITvMazeShow } from './tv-maze-show.interface';
import { ITvMazeCastMemberResponse } from './tv-maze-cast-member.interface';
import { TvMazeShowWithCastMember } from './tv-maze-show-with-cast-member.model';
import { TvMazeCastMember } from './tv-maze-cast-member.model';
import { TvMazeShow } from './tv-maze-show.model';

@Injectable()
export class TvMazeService {
	private static readonly api = 'http://api.tvmaze.com/shows';
	public static readonly maxParallelRequests = 20;

	private readonly activeShowRequestsSubject = new BehaviorSubject<any[]>([]);
	private readonly activeCastMemberRequestsSubject = new BehaviorSubject<any[]>([]);

	constructor(private readonly http: HttpService) {
		 this.activeCastMemberRequestsSubject.subscribe(_ => console.log('amount of requests: ', _.length));
	}

	public async showsWithCastMembers(page: number): Promise<TvMazeShowWithCastMember[]> {
		const tvMazeShows = await this.shows(page);
		const tvMazeShowsWithCastMembers = await tvMazeShows.map(async tvMazeShow =>
			new TvMazeShowWithCastMember(tvMazeShow.id, tvMazeShow.name, await this.castMembers(tvMazeShow.id)));
		return await Promise.all(tvMazeShowsWithCastMembers);
	}

	public shows(page: number = 1): Promise<ITvMazeShow[]> {
		const request$ = this.http.get<ITvMazeShow[]>(`${TvMazeService.api}?page=${page}`)
			.pipe(
				take(1),
				map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeShow)),
				tap(_ => console.log('GOT SHOWS', _.length)),
				retry(3),
			);
		return TvMazeService.delayRequestWhenOverMaxCount(request$, this.activeShowRequestsSubject, page).toPromise();
	}

	public castMembers(showId: number = 1): Promise<TvMazeCastMember[]> {
		const request$ = this.http.get<ITvMazeCastMemberResponse[]>(`${TvMazeService.api}/${showId}/cast`)
			.pipe(
				take(1),
				map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeCastMember)),
				tap(_ => console.log('GOT CASTMEMBERS OF SHOW: ', showId, _.length)),
				retry(3),
			);
		return TvMazeService.delayRequestWhenOverMaxCount(request$, this.activeCastMemberRequestsSubject, showId).toPromise();
	}

	private static createTvMazeCastMember(castMember: ITvMazeCastMemberResponse) {
		return new TvMazeCastMember(castMember.person.id, castMember.person.birthday, castMember.person.name);
	}

	private static createTvMazeShow(tvMazeShow: ITvMazeShow): TvMazeShow {
		return new TvMazeShow(tvMazeShow.id, tvMazeShow.name);
	}

	private static delayRequestWhenOverMaxCount<T>(
		request$: Observable<T>,
		activeRequestsSubject: BehaviorSubject<any[]>,
		key: any,
	): Observable<T> {
		const maxParallelRequestCountExceeded = activeRequestsSubject.getValue().length >= TvMazeService.maxParallelRequests;
		if (!maxParallelRequestCountExceeded) {
			console.log('adding request!!!! with ID', key);
			TvMazeService.addActiveRequest(activeRequestsSubject, key);
		}
		const delayedRequest = maxParallelRequestCountExceeded ? TvMazeService.delayedRequest(request$, activeRequestsSubject, key) : request$ ;
		// add request buffer stack removal logic to delayed AND proceeded requests when observable resolves
		return delayedRequest.pipe(
			tap(() => TvMazeService.removeActiveRequest(activeRequestsSubject, key)),
			catchError(error => TvMazeService.handleError(error, activeRequestsSubject, key)),
		);
	}

	private static handleError(error, activeRequestsSubject: BehaviorSubject<any[]>, element: any) {
		TvMazeService.removeActiveRequest(activeRequestsSubject, element);
		return throwError(`error occured while importing data ${error}`);
	}

	private static delayedRequest<T>(request$: Observable<T>,
	                                 activeRequestsSubject: BehaviorSubject<any[]>,
	                                 element: any): Observable<any> {
		return activeRequestsSubject.pipe(
			filter(currentlyActiveRequests => currentlyActiveRequests.length < TvMazeService.maxParallelRequests),
			take(1),
			map(() => TvMazeService.delayRequestWhenOverMaxCount(request$, activeRequestsSubject, element)),
			switchMap(() => request$),
		);
	}

	private static addActiveRequest(activeRequestsSubject: BehaviorSubject<any>, element): void {
		activeRequestsSubject.next([...activeRequestsSubject.getValue(), element]);
	}

	private static removeActiveRequest(activeRequestsSubject: BehaviorSubject<any>, element): void {
		activeRequestsSubject.next(activeRequestsSubject.getValue().filter(currentlyActiveRequestKey => currentlyActiveRequestKey !== element));
	}
}
