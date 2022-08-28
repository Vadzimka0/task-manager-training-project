import { NoteEntity } from '../entities/note.entity';

export type NoteApiType = NoteEntity & {
  owner_id: string;
};
