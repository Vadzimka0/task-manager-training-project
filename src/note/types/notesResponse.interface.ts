import { NoteEntity } from '../entities/note.entity';

export interface NotesResponseInterface {
  notes: NoteEntity[];
  notesCount: number;
}
