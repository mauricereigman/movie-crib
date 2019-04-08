import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CastMemberEntity } from './cast-member.entity';

@Entity('Show')
export class ShowEntity {
	@PrimaryGeneratedColumn() public readonly id: number;
	@Column('integer'/*, { unique: true }*/) public readonly tvMazeId: number;
	@Column('varchar') public readonly name: string;

	@ManyToMany(type => CastMemberEntity, castMember => castMember.shows, { cascade: true, onDelete: 'CASCADE'})
	@JoinTable({ name: 'Show_CastMember' })
	public castMembers: CastMemberEntity[];

	constructor(tvMazeId: number, name: string, castMembers: CastMemberEntity[]) {
		this.tvMazeId = tvMazeId;
		this.name = name;
		this.castMembers = castMembers;
	}
}
