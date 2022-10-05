import { ApiProperty } from '@nestjs/swagger';

import { NoteEntity } from '../entities/note.entity';

export class NoteApiDto extends NoteEntity {
  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  owner_id: string;
}
