import {Injectable} from '@nestjs/common';
import {ShowEntity} from '../../entities/show.entity';
import {DeleteResult, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class ShowsService {
	private static readonly pageSize = 100;

	constructor(@InjectRepository(ShowEntity) private readonly showRepository: Repository<ShowEntity>) {
	}

	async saveShows(showEntities: ShowEntity[]): Promise<ShowEntity[]> {
		console.log('saving shows', showEntities.length);
		return this.showRepository.save(showEntities);
	}

	async deleteShows(): Promise<DeleteResult> {
		return await this.showRepository.delete({});
	}

	async shows(page: number = 0): Promise<ShowEntity[]> {
		const shows = await this.showRepository.find({
			order: { id: 'ASC' },
			relations: ['castMembers'],
			take: ShowsService.pageSize,
			skip: page * ShowsService.pageSize,
		});
		return shows.map(show => {
			show.castMembers = show.castMembers.sort((a, b) => new Date(b.birthday).getTime() - new Date(a.birthday).getTime());
			return show;
		});
	}
}
