import { TvMazeCastMember } from './tv-maze-cast-member.model';
import { ITvMazeCastMember } from './tv-maze-cast-member.interface';
import { ShowEntity } from '../../entities/show.entity';

export class TvMazeShowWithCastMember implements TvMazeShowWithCastMember {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly castMembers: TvMazeCastMember[]) {
	}

	toDatabaseModel(): ShowEntity {
		return new ShowEntity(this.id, this.name, this.castMembers.map(castMember => castMember.toDatabaseModel()));
	}
}
