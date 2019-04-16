import {Test, TestingModule} from '@nestjs/testing';
import {TvMazeService} from './tv-maze.service';

describe('TvMazeService', () => {
	let service: TvMazeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TvMazeService],
		}).compile();

		service = module.get<TvMazeService>(TvMazeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
