import { HttpModule, Module } from '@nestjs/common';
import { ShowsController } from './controllers/shows/shows.controller';
import { CastMembersController } from './controllers/cast-members/cast-members.controller';
import { CastMembersService } from './services/cast-members/cast-members.service';
import { TvMazeService } from './services/tv-maze/tv-maze.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CastMemberEntity } from './entities/cast-member.entity';
import { ShowEntity } from './entities/show.entity';
import { ShowsService } from './services/shows/shows.service';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: '0.0.0.0',
			port: 5436,
			username: 'postgres',
			password: 'root',
			database: 'tv-shows-api',
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
			logging: false,
		}),
		TypeOrmModule.forFeature([ShowEntity, CastMemberEntity]),
		HttpModule,
	],
	controllers: [ShowsController, CastMembersController],
	providers: [TvMazeService, CastMembersService, ShowsService],
})
export class AppModule {
}
