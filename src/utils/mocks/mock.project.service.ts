import { mockedProject, mockedUpdatedProject } from '../../project/tests/project.test-data';
import { mockedUserId } from '../../user/tests/user.test-data';

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
