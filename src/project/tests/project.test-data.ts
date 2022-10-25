import { mockedUser, mockedUserId } from '../../../test/user.test-data';
import { CreateProjectDto, ProjectApiDto } from '../dto';
import { ProjectEntity } from '../entities/project.entity';
import { v4 as uuidv4 } from 'uuid';

export const mockedProjectId = '3b4e9041-22d2-49eb-828a-b84919c7eff8';

export const createProjectDto: CreateProjectDto = {
  title: 'title',
  color: '#ffffff',
  owner_id: mockedUserId,
};

export const createProjectDto2: CreateProjectDto = {
  ...createProjectDto,
  title: 'Lorem ipsum dolor sit amet augue.',
};

export const updateProjectDto: CreateProjectDto = {
  ...createProjectDto,
  title: 'updated title',
};

export const updateProjectDto2 = {
  title: 'updated title',
  owner_id: mockedUserId,
};

export const projectApiDto: Partial<ProjectApiDto> = {
  ...createProjectDto,
  id: expect.any(String),
  created_at: expect.any(String),
};

export const updatedProjectApiDto: Partial<ProjectApiDto> = {
  ...updateProjectDto,
  id: expect.any(String),
  created_at: expect.any(String),
};

export const mockedProject: Partial<ProjectEntity> = {
  id: uuidv4(),
  created_at: new Date(),
  title: 'title',
  color: '#ffffff',
  owner: mockedUser,
};

export const mockedPersonalProject: Partial<ProjectEntity> = {
  ...mockedProject,
  title: 'Personal',
};

export const mockedProjects: Partial<ProjectEntity>[] = [mockedProject];
