import { v4 as uuidv4 } from 'uuid';

import { mockedUser, mockedUserId } from '../../../test/user.test-data';
import { ProjectEntity } from '../../project/entities/project.entity';
import { mockedProject, mockedProjectId } from '../../project/tests/project.test-data';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';

export const mockedTaskId = '3b4e9041-22d2-49eb-828a-b84919c7eff8';
export const mockedAssignedToId = '0ac03242-1f56-4a7e-904f-d8eaf9f3379c';

export const createTaskDto: CreateTaskDto = {
  title: 'title',
  description: 'description',
  due_date: new Date(),
  is_completed: false,
  assigned_to: mockedAssignedToId,
  project_id: mockedProjectId,
  owner_id: mockedUserId,
  members: null,
  attachments: null,
};

// export const taskApiDto: Partial<TaskApiDto> = {
//   ...createTaskDto,
//   id: expect.any(String),
//   created_at: expect.any(String),
//   members: null,
// };

export const mockedTask: Partial<TaskEntity> = {
  id: uuidv4(),
  created_at: new Date(),
  title: 'title',
  description: 'description',
  due_date: new Date(),
  is_completed: false,
  performer: mockedUser,
  project: mockedProject as ProjectEntity,
  members: null,
  attachments: null,
};

export const mockedTasks: Partial<TaskEntity>[] = [mockedTask];
