import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Has to be no more than 32 characters',
    example: 'education',
  })
  @IsNotEmpty()
  @MaxLength(32)
  readonly title: string;

  @ApiProperty({
    description: 'Has to match a HEX color (7 characters)',
    example: '#ff6347',
  })
  @IsNotEmpty()
  readonly color: string;

  @ApiProperty({
    description: 'Has to match a uuid',
    example: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  })
  @IsNotEmpty()
  readonly owner_id: string;
}
