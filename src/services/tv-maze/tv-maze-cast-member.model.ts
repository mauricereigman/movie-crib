import {ITvMazeCastMember} from './tv-maze-cast-member.interface';
import {CastMemberEntity} from '../../entities/cast-member.entity';

export class TvMazeCastMember implements ITvMazeCastMember {
	constructor(public readonly id: number,
	            public readonly birthday: string,
	            public readonly name: string) {
	}

	public toDatabaseModel(): CastMemberEntity {
		return new CastMemberEntity(this.id, this.name, this.birthday);
	}
}
