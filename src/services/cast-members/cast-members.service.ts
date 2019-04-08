import { Injectable } from '@nestjs/common';
import { ShowEntity } from '../../entities/show.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CastMemberEntity } from '../../entities/cast-member.entity';

@Injectable()
export class CastMembersService {
	constructor(@InjectRepository(CastMemberEntity) private readonly castMemberRepository: Repository<CastMemberEntity>) {
	}

	public savedCastMembers() {
		return this.castMemberRepository.find();
	}
}
