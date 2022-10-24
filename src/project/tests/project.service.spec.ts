import {
  BadRequestException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { mockedUser } from '../../../test/user.test-data';
import { MockType } from '../../utils/mocks/mock.type';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectService } from '../project.service';
import {
  createProjectDto,
  mockProjectId,
  projectEntities,
  projectEntity,
  projectPersonalEntity,
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
    getMany: jest.fn().mockResolvedValue(projectEntities),
    getRawMany: jest.fn().mockResolvedValue(projectEntities),
    getOne: jest.fn().mockResolvedValue(null),
  })),
}));

describe('The ProjectService', () => {
  let service: ProjectService;
  let repositoryMock: MockType<Repository<ProjectEntity>>;

  const entityNotExists = () => {
    repositoryMock.findOneBy.mockResolvedValue(null);
    expect(service.fetchProject(mockedUser.id, mockProjectId)).rejects.toThrow(
      InternalServerErrorException,
    );
  };
  const entityProtected = () => {
    repositoryMock.findOneBy.mockResolvedValue(projectPersonalEntity);
    expect(service.deleteProject(mockedUser.id, mockProjectId)).rejects.toThrow(
      BadRequestException,
    );
  };

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
      repositoryMock.save.mockResolvedValue(projectEntity);
      const createdProject = await service.createProject(createProjectDto, mockedUser);
      expect(createdProject).toEqual(projectEntity);
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
      repositoryMock.findOneBy.mockResolvedValue(projectEntity);
      repositoryMock.save.mockResolvedValue(projectEntity);
      const updatedProject = await service.updateProject(
        createProjectDto,
        mockedUser.id,
        mockProjectId,
      );
      expect(updatedProject).toEqual(projectEntity);
    });

    it('should throw the "InternalServerErrorException" otherwise', entityNotExists);
    it('should throw the "BadRequestException" if project is protected', entityProtected);
  });

  describe('deleteProject', () => {
    it('should return the projectId if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(projectEntity);
      const deletedProject = await service.deleteProject(mockedUser.id, mockProjectId);
      expect(deletedProject).toEqual({ id: mockProjectId });
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockProjectId });
    });

    it('should throw the "InternalServerErrorException" otherwise', entityNotExists);
    it('should throw the "BadRequestException" if project is protected', entityProtected);
  });

  describe('fetchProject', () => {
    it('should return the project if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(projectEntity);
      const fetchedProject = await service.fetchProject(mockedUser.id, mockProjectId);
      expect(fetchedProject).toEqual(projectEntity);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockProjectId });
    });

    it('should throw the "InternalServerErrorException" otherwise', entityNotExists);
  });

  describe('fetchUserProjects', () => {
    it('should return the user projects ', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().andWhere().orderBy().getMany();
      const fetchedProjects = await service.fetchUserProjects(mockedUser.id, mockedUser.id);
      expect(fetchedProjects).toEqual(projectEntities);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
