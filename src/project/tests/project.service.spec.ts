import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { mockedUser } from '../../../test/user.test-data';
import { MockType } from '../../utils/mocks/mock.type';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectService } from '../project.service';
import {
  createProjectDto,
  mockedPersonalProject,
  mockedProject,
  mockedProjectId,
  mockedProjects,
  mockedUpdatedProject,
  updateProjectDto,
} from './project.test-data';

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockedProjects),
    getRawMany: jest.fn().mockResolvedValue(mockedProjects),
    getOne: jest.fn().mockResolvedValue(null),
  })),
}));

describe('The ProjectService', () => {
  let service: ProjectService;
  let repositoryMock: MockType<Repository<ProjectEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: getRepositoryToken(ProjectEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repositoryMock = await module.get(getRepositoryToken(ProjectEntity));
  });

  describe('createProject', () => {
    it('should create a new project record and return that', async () => {
      repositoryMock.save.mockResolvedValue(mockedProject);
      const createdProject = await service.createProject(createProjectDto, mockedUser);
      expect(createdProject).toEqual(mockedProject);
    });

    it('should throw the "UnprocessableEntityException" if color is not valid', async () => {
      const createProjectInvalidDto = { ...createProjectDto, color: '#yellow' };
      expect(service.createProject(createProjectInvalidDto, mockedUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updateProject', () => {
    it('should update the project if ID exists and return updated Project', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockedUpdatedProject);
      repositoryMock.save.mockResolvedValue(mockedUpdatedProject);
      const updatedProject = await service.updateProject(
        updateProjectDto,
        mockedUser.id,
        mockedProjectId,
      );
      expect(updatedProject).toEqual(mockedUpdatedProject);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockedProjectId });
    });

    it('should throw the "InternalServerErrorException" otherwise', () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      expect(service.fetchProject(mockedUser.id, mockedProjectId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw the "UnprocessableEntityException" if project is protected', () => {
      repositoryMock.findOneBy.mockResolvedValue(mockedPersonalProject);
      expect(service.deleteProject(mockedUser.id, mockedProjectId)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('deleteProject', () => {
    it('should return the projectId if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockedProject);
      const deletedProject = await service.deleteProject(mockedUser.id, mockedProjectId);
      expect(deletedProject).toEqual({ id: mockedProjectId });
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockedProjectId });
    });
  });

  describe('fetchProject', () => {
    it('should return the project if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockedProject);
      const fetchedProject = await service.fetchProject(mockedUser.id, mockedProjectId);
      expect(fetchedProject).toEqual(mockedProject);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockedProjectId });
    });
  });

  describe('fetchUserProjects', () => {
    it('should return the user projects ', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().andWhere().orderBy().getMany();
      const fetchedProjects = await service.fetchUserProjects(mockedUser.id, mockedUser.id);
      expect(fetchedProjects).toEqual(mockedProjects);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
