import { Controller, Delete, Get, Query, Req } from '@nestjs/common';
import { TvMazeService } from '../../services/tv-maze/tv-maze.service';
import { ShowsService } from '../../services/shows/shows.service';
import { ShowEntity } from '../../entities/show.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import {Request} from 'express';
import {arrayOfSize} from '../../utils/array-of-size';

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
	public async importShowsAndCastMembers(@Req() request: Request): Promise<string> {
		request.setTimeout(0, () => {});
		const savedShows = await this.saveShows(10);
		return `successfully saved ${savedShows.length} shows`;
	}

	@Delete('import')
	truncate(): Promise<DeleteResult> {
		return this.showsService.deleteShows();
	}

	private async saveShows(amountOfPaginatedRequests: number): Promise<ShowEntity[]> {
		return  arrayOfSize(amountOfPaginatedRequests)
			.map(async pageNumber => {
				const tvMazeShowsWithCastMembers = await this.tvMazeService.showsWithCastMembers(pageNumber);
				return tvMazeShowsWithCastMembers.map(show => show.toDatabaseModel());
			}).reduce(async (prev, curr) => [...await prev, ...await curr])
	}
}
