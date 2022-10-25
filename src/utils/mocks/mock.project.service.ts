import { mockedProject } from '../../project/tests/project.test-data';

export const mockedProjectService = {
  fetchProject: jest.fn((userId, projectId) => {
    return mockedProject;
  }),

  // updateNote: jest.fn((dto, _, noteId) => {
  //   return {
  //     ...dto,
  //     id: noteId,
  //     created_at: new Date(),
  //   };
  // }),

  // getRequiredFormatNote: jest.fn((note) => {
  //   return {
  //     ...note,
  //     owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  //   };
  // }),
};
