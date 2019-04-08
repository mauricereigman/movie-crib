import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShowEntity } from './show.entity';

@Entity('CastMember')
export class CastMemberEntity {
	@PrimaryGeneratedColumn() public readonly id: number;
	@Column('integer'/*, { unique: true }*/) public readonly tvMazeId: number;
	@Column('varchar') public readonly name: string;
	@Column('date', {nullable: true}) public readonly birthday?: string;

	@ManyToMany(type => ShowEntity, show => show.castMembers)
	shows: ShowEntity[];

	constructor(tvMazeId: number, name: string, birthday: string) {
		this.tvMazeId = tvMazeId;
		this.name = name;
		this.birthday = birthday;
	}
}
