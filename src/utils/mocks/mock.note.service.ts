import { v4 as uuidv4 } from 'uuid';

export const mockedNoteService = {
  createNote: jest.fn((dto, _) => {
    return {
      ...dto,
      id: uuidv4(),
      created_at: new Date().toDateString(),
      is_completed: false,
    };
  }),

  updateNote: jest.fn((dto, _, noteId) => {
    return {
      ...dto,
      id: noteId,
      created_at: new Date(),
    };
  }),

  getRequiredFormatNote: jest.fn((note) => {
    return {
      ...note,
      owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
    };
  }),
};
