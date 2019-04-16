import {Controller, Delete, Get, Query, Req} from '@nestjs/common';
import {TvMazeService} from '../../services/tv-maze/tv-maze.service';
import {ShowsService} from '../../services/shows/shows.service';
import {ShowEntity} from '../../entities/show.entity';
import {ApiUseTags} from '@nestjs/swagger';
import {DeleteResult} from 'typeorm';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@ApiUseTags('shows')
@Controller('shows')
export class ShowsController {
	constructor(private readonly tvMazeService: TvMazeService,
	            private readonly showsService: ShowsService) {
	}

	@Get('')
	shows(@Query('page') page?: number): Promise<ShowEntity[]> {
		return this.showsService.shows(page);
	}

	@Get('import')
	public importShows(@Req() request: Request): Observable<string> {
		return this.saveShows(150)
			.pipe(
				map(shows => `successfully saved ${shows.length} shows`)
			)
	}

	@Delete('import')
	truncate(): Promise<DeleteResult> {
		return this.showsService.deleteShows();
	}

	private saveShows(amountOfPaginatedRequests: number): Observable<ShowEntity[]> {
		return this.tvMazeService.showsStream$(amountOfPaginatedRequests)
			.pipe(
				map(shows => shows.map(show => show.toDatabaseModel())),
				switchMap(dbShows => this.showsService.saveShows(dbShows)),
			);
	}
}
