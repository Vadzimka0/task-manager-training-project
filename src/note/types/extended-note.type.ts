import { NoteEntity } from '../entities/note.entity';

export type ExtendedNoteType = NoteEntity & {
  owner_id: string;
};
