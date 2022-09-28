import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Has to be no more than 512 characters',
    example: 'buy book',
  })
  @IsNotEmpty()
  @MaxLength(512)
  readonly description: string;

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
  @IsUUID()
  readonly owner_id: string;
}
