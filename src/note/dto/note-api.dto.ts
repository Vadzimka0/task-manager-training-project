import { ApiProperty } from '@nestjs/swagger';

import { UpdateNoteDto } from './update-note.dto';

export class NoteApiDto extends UpdateNoteDto {
  @ApiProperty({
    description: 'Note ID',
    example: 'd091f63d-157f-4835-9038-e33d3e996fb7',
  })
  readonly id: string;

  @ApiProperty()
  readonly created_at: Date;
}
