import {ITvMazeShow} from './tv-maze-show.interface';
import {ShowEntity} from '../../entities/show.entity';

export class TvMazeShow implements ITvMazeShow {
	constructor(
		public readonly id: number,
		public readonly name: string) {
	}

	public toDatabaseModel(): ShowEntity {
		return new ShowEntity(this.id, this.name, []);
	}
}
