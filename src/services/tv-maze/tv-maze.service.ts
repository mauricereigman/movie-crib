import {HttpService, Injectable} from '@nestjs/common';
import {concat, Observable, throwError, timer} from 'rxjs';
import {catchError, concatMap, map, retryWhen, switchMap, take, tap, toArray} from 'rxjs/operators';
import {ITvMazeShow} from './tv-maze-show.interface';
import {ITvMazeCastMemberResponse} from './tv-maze-cast-member.interface';
import {TvMazeShowWithCastMember} from './tv-maze-show-with-cast-member.model';
import {TvMazeCastMember} from './tv-maze-cast-member.model';
import {TvMazeShow} from './tv-maze-show.model';
import {arrayOfSize} from '../../utils/array-of-size';

@Injectable()
export class TvMazeService {
	private static readonly api = 'http://api.tvmaze.com/shows';

	constructor(private readonly http: HttpService) {
		this.http.axiosRef.interceptors.request.use(config => {
			console.log(config.url);
			return config;
		});
	}

	public showsStream$(amountOfPages: number): Observable<TvMazeShowWithCastMember[]> {
		const requests = arrayOfSize(amountOfPages)
			.map(pageNumber => {
				return this.http.get<ITvMazeShow[]>(`${TvMazeService.api}?page=${pageNumber}`)
					.pipe(
						take(1),
						map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeShow)),
						tap(_ => console.log(`retrieved ${_.length} shows`)),
						switchMap(shows => shows.map(show => this.castMembers$(show.id)
							.pipe(map(castMembers => new TvMazeShowWithCastMember(show.id, show.name, castMembers))))
						),
						concatMap(TvMazeShowWithCastMembers => TvMazeShowWithCastMembers),
						toArray(),
						catchError(error => TvMazeService.handleError(error, pageNumber, 'shows')),
					);
			});

		return concat(...requests);
	}

	public castMembers$(showId: number = 1): Observable<TvMazeCastMember[]> {
		return this.http.get<ITvMazeCastMemberResponse[]>(`${TvMazeService.api}/${showId}/cast`)
			.pipe(
				take(1),
				retryWhen(() => timer(3000)),
				map(axiosResponse => axiosResponse.data.map(TvMazeService.createTvMazeCastMember)),
				tap(_ => console.log(`retrieved ${_.length} castMembers`)),
				catchError(error => TvMazeService.handleError(error, showId, 'castmembers')),
			);
	}

	private static createTvMazeCastMember(castMember: ITvMazeCastMemberResponse): TvMazeCastMember {
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
}
