import { mockedComment, mockedComments } from '../../task/tests/comment.test-data';
import { mockedTaskId } from '../../task/tests/task.test-data';
import { mockedUserId } from '../../user/tests/user.test-data';

export const mockedCommentService = {
  fetchTaskComments: jest.fn((taskId) => mockedComments),

  createComment: jest.fn((dto, user) => mockedComment),

  deleteComment: jest.fn((userId, commentId) => ({ id: commentId })),

  getRequiredFormatComment: jest.fn((comment) => {
    delete comment.task;

    return {
      ...comment,
      owner_id: mockedUserId,
      task_id: mockedTaskId,
    };
  }),
};
