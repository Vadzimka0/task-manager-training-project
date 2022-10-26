import { mockedUserId } from '../../../test/user.test-data';
import { mockedProject, mockedUpdatedProject } from '../../project/tests/project.test-data';

export const mockedProjectService = {
  fetchProject: jest.fn((userId, projectId) => mockedProject),

  createProject: jest.fn((dto, user) => mockedProject),

  updateProject: jest.fn((dto, userId, projectId) => mockedUpdatedProject),

  deleteProject: jest.fn((userId, projectId) => ({ id: projectId })),

  getRequiredFormatProject: jest.fn((project) => {
    delete project.owner;

    return {
      ...project,
      owner_id: mockedUserId,
    };
  }),
};
