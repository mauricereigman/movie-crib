import { Controller, Delete, Get, Query, Req } from '@nestjs/common';
import { TvMazeService } from '../../services/tv-maze/tv-maze.service';
import { ShowsService } from '../../services/shows/shows.service';
import { ShowEntity } from '../../entities/show.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import {Request} from 'express';

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
		return `succesfully saved ${savedShows.length} shows`;
	}

	@Delete('import')
	truncate(): Promise<DeleteResult> {
		return this.showsService.deleteShows();
	}

	private async saveShows(amountOfPaginatedRequests: number): Promise<ShowEntity[]> {
		return ShowsController.createArrayOfSize(amountOfPaginatedRequests)
			.map(async pageNumber => {
				const tvMazeShowsWithCastMembers = await this.tvMazeService.showsWithCastMembers(pageNumber);
				const tvMazeShows = await tvMazeShowsWithCastMembers;
				const showEntities = tvMazeShows.map(show => show.toDatabaseModel());
				return this.showsService.saveShows(await showEntities);
			}).reduce(async (prev, curr) => [...await prev, ...await curr]);
	}

	private static createArrayOfSize(amount: number): number[] {
		return [...new Array(amount)].map((value, index) => index);
	}
}
