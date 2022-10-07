import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends CreateNoteDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  readonly is_completed: boolean;
}
