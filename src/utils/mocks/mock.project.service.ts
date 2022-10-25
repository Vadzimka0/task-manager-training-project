import { v4 as uuidv4 } from 'uuid';

import { mockedProject } from '../../project/tests/project.test-data';
import { mockedUserId } from '../../../test/user.test-data';

export const mockedProjectService = {
  fetchProject: jest.fn((userId, projectId) => {
    return mockedProject;
  }),

  createProject: jest.fn((dto, user) => {
    return {
      ...dto,
      id: uuidv4(),
      created_at: new Date().toDateString(),
    };
  }),

  updateProject: jest.fn((dto, userId, projectId) => {
    return {
      ...dto,
      id: projectId,
      created_at: new Date(),
    };
  }),

  deleteProject: jest.fn((userId, projectId) => ({ id: projectId })),

  getRequiredFormatProject: jest.fn((project) => {
    delete project.owner;

    return {
      ...project,
      owner_id: mockedUserId,
    };
  }),
};
