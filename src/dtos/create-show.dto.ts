import { IsNumber, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateShowDto {
	@IsNumber()
	@ApiModelProperty()
	public readonly tvMazeId: number;

	@IsString()
	@ApiModelProperty()
	public readonly name: string;
}
