import { ITvMazeShow } from './tv-maze-show.interface';

export class TvMazeShow implements ITvMazeShow {
	constructor(
		public readonly id: number,
		public readonly name: string) {
	}
}
