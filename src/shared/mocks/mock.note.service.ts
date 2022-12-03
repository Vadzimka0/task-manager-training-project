import { mockedNote, mockedUpdatedNote } from '../../note/tests/note.test-data';
import { mockedUserId } from '../../user/tests/user.test-data';

export const mockedNoteService = {
  fetchOneNote: jest.fn((userId, noteId) => mockedNote),

  createNote: jest.fn((dto, user) => mockedNote),

  updateNote: jest.fn((dto, userId, noteId) => mockedUpdatedNote),

  deleteNote: jest.fn((userId, noteId) => ({ id: noteId })),

  getRequiredFormatNote: jest.fn((note) => {
    delete note.owner;

    return {
      ...note,
      owner_id: mockedUserId,
    };
  }),
};
