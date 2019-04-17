import {HttpModule, Module} from '@nestjs/common';
import {ShowsController} from './controllers/shows/shows.controller';
import {CastMembersController} from './controllers/cast-members/cast-members.controller';
import {CastMembersService} from './services/cast-members/cast-members.service';
import {TvMazeService} from './services/tv-maze/tv-maze.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CastMemberEntity} from './entities/cast-member.entity';
import {ShowEntity} from './entities/show.entity';
import {ShowsService} from './services/shows/shows.service';

console.log(__dirname);
@Module({
	imports: [
		TypeOrmModule.forRoot(),
		TypeOrmModule.forFeature([ShowEntity, CastMemberEntity]),
		HttpModule.register({
			timeout: 50000,
			maxRedirects: 5,
		}),
	],
	controllers: [ShowsController, CastMembersController],
	providers: [TvMazeService, CastMembersService, ShowsService],
})
export class AppModule {
}
