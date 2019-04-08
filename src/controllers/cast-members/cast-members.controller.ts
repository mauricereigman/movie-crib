import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CastMembersService } from '../../services/cast-members/cast-members.service';
import { CastMemberEntity } from '../../entities/cast-member.entity';

@ApiUseTags('cast-members')
@Controller('cast-members')
export class CastMembersController {

	constructor(private readonly castMembersService: CastMembersService) {}

	@Get('')
	castMembers(): Promise<CastMemberEntity[]> {
		return this.castMembersService.savedCastMembers();
	}
}
