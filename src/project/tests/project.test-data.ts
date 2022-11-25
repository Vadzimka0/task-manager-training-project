import { v4 as uuidv4 } from 'uuid';

import { mockedUser, mockedUserId } from '../../user/tests/user.test-data';
import { CreateProjectDto, ProjectApiDto } from '../dto';
import { ProjectEntity } from '../entities/project.entity';

export const mockedProjectId = '533a6c9a-faa4-4436-8361-bb71ad2b9e8b';
const mockedProjectTitle = 'title';
export const mockedProjectUpdatedTitle = 'updated title';
const mockedProjectInvalidTitle = 'Lorem ipsum dolor sit amet augue.';
const mockedProjectColor = '#ffffff';

export const createProjectDto: CreateProjectDto = {
  title: mockedProjectTitle,
  color: mockedProjectColor,
  owner_id: mockedUserId,
};

export const createProjectInvalidDto: CreateProjectDto = {
  ...createProjectDto,
  title: mockedProjectInvalidTitle,
};

export const updateProjectDto: CreateProjectDto = {
  ...createProjectDto,
  title: mockedProjectUpdatedTitle,
};

export const updateProjectMissingFieldDto = {
  title: mockedProjectTitle,
  owner_id: mockedUserId,
};

export const projectApiDto: Partial<ProjectApiDto> = {
  ...createProjectDto,
  id: expect.any(String),
  created_at: expect.any(String),
};

export const updatedProjectApiDto: Partial<ProjectApiDto> = {
  ...projectApiDto,
  title: mockedProjectUpdatedTitle,
};

export const mockedProject: Partial<ProjectEntity> = {
  id: uuidv4(),
  created_at: new Date().toISOString(),
  // created_at: new Date(),
  title: mockedProjectTitle,
  color: mockedProjectColor,
  owner: mockedUser,
};

export const mockedUpdatedProject: Partial<ProjectEntity> = {
  ...mockedProject,
  title: mockedProjectUpdatedTitle,
};

export const mockedPersonalProject: Partial<ProjectEntity> = {
  ...mockedProject,
  title: 'Personal',
};

export const mockedProjects: Partial<ProjectEntity>[] = [mockedProject];
