import {HttpService} from '@nestjs/common';
import {Observable, of} from 'rxjs';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {TvMazeService} from './tv-maze.service';
import {ITvMazeCastMemberResponse} from './tv-maze-cast-member.interface';

export class HttpServiceMock extends HttpService {
	constructor() {
		super();
	}

	get<T>(url: string, config?: AxiosRequestConfig): Observable<AxiosResponse<any>> {
		switch (url) {
			case `${TvMazeService.api}?page=${0}`:
				return this.showsMock$;
			default:
				return this.castMembersMock$;
		}
	}

	private showsMock$ = of({
		status: undefined,
		statusText: undefined,
		headers: undefined,
		config: undefined,
		data: [
			{
				id: 1,
				name: 'south park',
			}
		]
	});

	private castMembersMock$: Observable<AxiosResponse<ITvMazeCastMemberResponse[]>> = of({
		status: undefined,
		statusText: undefined,
		headers: undefined,
		config: undefined,
		data: [
			{
				person: {
					id: 1,
					name: 'henk',
					birthday: '19-02-2000',
				}
			}
		]
	});
}

