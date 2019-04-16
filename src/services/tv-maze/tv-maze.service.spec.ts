import {Test, TestingModule} from '@nestjs/testing';
import {TvMazeService} from './tv-maze.service';
import {HttpModule, HttpService} from '@nestjs/common';
import {TvMazeShowWithCastMember} from './tv-maze-show-with-cast-member.model';
import {tap} from 'rxjs/operators';
import {HttpServiceMock} from './tv-maze.service.spec.helper';

describe('TvMazeService', () => {
	let service: TvMazeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TvMazeService,
				{
					provide: HttpService,
					useValue: new HttpServiceMock()
				}
			],
		}).compile();

		service = module.get<TvMazeService>(TvMazeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should be defined', async () => {
		const shows = await service.showsStream$(1)
			.pipe(tap(console.log))
			.toPromise();
		expect(shows[0] instanceof TvMazeShowWithCastMember ).toBeTruthy()
	});
});
