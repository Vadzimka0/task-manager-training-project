import { mockedProjectId } from '../../project/tests/project.test-data';
import { mockedAssignedToId, mockedTask, mockedUpdatedTask } from '../../task/tests/task.test-data';
import { mockedUserId } from '../../user/tests/user.test-data';

export const mockedTaskService = {
  fetchTask: jest.fn((taskId) => mockedTask),

  createTask: jest.fn((dto, user) => mockedTask),

  updateTask: jest.fn((dto, user, taskId) => mockedUpdatedTask),

  deleteTask: jest.fn((userId, taskId) => ({ id: taskId })),

  getRequiredFormatTask: jest.fn((task) => {
    delete task.project;
    delete task.performer;

    return {
      ...task,
      owner_id: mockedUserId,
      project_id: mockedProjectId,
      assigned_to: mockedAssignedToId,
    };
  }),

  idsMatching: jest.fn(),

  getTaskForComment: jest.fn(),
};
