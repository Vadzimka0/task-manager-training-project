import { v4 as uuidv4 } from 'uuid';

import { ProjectEntity } from '../../project/entities/project.entity';
import { mockedProject, mockedProjectId } from '../../project/tests/project.test-data';
import { mockedUser, mockedUserId } from '../../user/tests/user.test-data';
import { TaskApiDto } from '../dto/api-dto/task-api.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';

export const mockedTaskId = '77518aa4-4e99-4538-bddc-b979eb4e4592';
const mockedTaskTitle = 'title';
const mockedTaskInvalidTitle =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate vulputate diam eu malesuada. Cras eget orci vitae massa semper pellentesque sit amet eget ligula. Integer ornare turpis ut justo rhoncus posuere. Nunc ac sem massa. Vestibulum ac.';
const mockedTaskDescription = 'description';
export const mockedAssignedToId = '0ac03242-1f56-4a7e-904f-d8eaf9f3379c';

export const createTaskDto: CreateTaskDto = {
  title: mockedTaskTitle,
  description: mockedTaskDescription,
  due_date: new Date(),
  is_completed: false,
  assigned_to: mockedAssignedToId,
  project_id: mockedProjectId,
  owner_id: mockedUserId,
  members: null,
  attachments: null,
};

export const createTaskInvalidDto: CreateTaskDto = {
  ...createTaskDto,
  title: mockedTaskInvalidTitle,
};

export const updateTaskDto: CreateTaskDto = {
  ...createTaskDto,
  is_completed: true,
};

export const updateTaskMissingFieldDto = {
  title: mockedTaskTitle,
  description: mockedTaskDescription,
  due_date: new Date(),
  is_completed: false,
};

export const taskApiDto: Partial<TaskApiDto> = {
  ...createTaskDto,
  id: expect.any(String),
  created_at: expect.any(String),
  due_date: expect.any(String),
  members: null,
};

export const updatedTaskApiDto: Partial<TaskApiDto> = {
  ...taskApiDto,
  is_completed: true,
};

export const mockedTask: Partial<TaskEntity> = {
  id: uuidv4(),
  created_at: new Date(),
  title: mockedTaskTitle,
  description: mockedTaskDescription,
  // due_date: new Date(),
  due_date: new Date().toISOString(),
  is_completed: false,
  performer: mockedUser,
  project: mockedProject as ProjectEntity,
  members: null,
  attachments: null,
};

export const mockedUpdatedTask: Partial<TaskEntity> = {
  ...mockedTask,
  is_completed: true,
};

export const mockedTasks: Partial<TaskEntity>[] = [mockedTask];
