import { mockedUser, mockedUserId } from '../../../test/user.test-data';
import { CreateProjectDto, ProjectApiDto } from '../dto';
import { ProjectEntity } from '../entities/project.entity';

export const mockProjectId = '3b4e9041-22d2-49eb-828a-b84919c7eff8';

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

export const projectEntity: Partial<ProjectEntity> = {
  id: expect.any(String),
  created_at: expect.any(String),
  title: 'title',
  color: '#ffffff',
  owner: mockedUser,
};

export const projectPersonalEntity: Partial<ProjectEntity> = {
  id: expect.any(String),
  created_at: expect.any(String),
  title: 'Personal',
  color: '#ffffff',
  owner: mockedUser,
};

export const projectEntities: Partial<ProjectEntity>[] = [
  {
    id: expect.any(String),
    created_at: expect.any(String),
    title: 'title',
    color: '#ffffff',
    owner: mockedUser,
  },
];
