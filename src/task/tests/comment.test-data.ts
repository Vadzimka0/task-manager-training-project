import { v4 as uuidv4 } from 'uuid';

import { mockedUser, mockedUserId } from '../../../test/user.test-data';
import { CommentApiDto } from '../dto/api-dto/comment-api.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { TaskEntity } from '../entities/task.entity';
import { mockedTask, mockedTaskId } from './task.test-data';

const mockedCommentContent = 'content';
const mockedCommentInvalidContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dolor sem, mollis ut accumsan vel, molestie et orci. Integer egestas velit lobortis augue laoreet, et ultricies velit aliquet. Mauris magna libero, lobortis sed sodales dignissim, pulvinar id quam. Nullam rhoncus odio a nulla iaculis viverra. Vivamus lacinia urna vel neque tempus, ac malesuada lorem blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam quis est suscipit, placerat nulla non, lacinia libero. Vivamus porttitor pellentesque posuere. Nam auctor felis nec vehicula volutpat. Maecenas non arcu id turpis sagittis aliquet. Aenean rutrum pretium pharetra. Ut efficitur orci a molestie imperdiet. Integer ullamcorper quam at sodales suscipit. Nunc posuere maximus iaculis. Donec in felis nec erat ullamcorper dignissim. In hac habitasse platea dictumst. In hac habitasse platea dictumst. Vestibulum congue efficitur tortor nec feugiat. Suspendisse potenti. Donec ultricies magna in metus euismod cras.`;

export const createCommentDto: CreateCommentDto = {
  content: mockedCommentContent,
  owner_id: mockedUserId,
  task_id: mockedTaskId,
};

export const createCommentInvalidDto: CreateCommentDto = {
  ...createCommentDto,
  content: mockedCommentInvalidContent,
};

export const commentApiDto: Partial<CommentApiDto> = {
  ...createCommentDto,
  id: expect.any(String),
  created_at: expect.any(String),
  attachments: null,
  commentator: mockedUser,
};

export const mockedComment: Partial<CommentEntity> = {
  id: uuidv4(),
  created_at: new Date(),
  content: mockedCommentContent,
  attachments: null,
  commentator: mockedUser,
  task: mockedTask as TaskEntity,
};

export const mockedComments: Partial<CommentEntity>[] = [mockedComment];
