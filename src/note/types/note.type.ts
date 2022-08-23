import { NoteEntity } from '../entities/note.entity';

export type NoteType = NoteEntity & {
  owner_id: string;
};
