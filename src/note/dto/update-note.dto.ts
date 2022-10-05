import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends CreateNoteDto {
  @ApiProperty({
    description: 'Has to match a boolean value',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;
}
