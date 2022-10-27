import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectService } from '../../project/project.service';
import { UserAvatarService } from '../../user/services';
import { UserService } from '../../user/services/user.service';
import { mockedProjectService, mockedUserService, MockType } from '../../utils/mocks';
import { TaskEntity } from '../entities/task.entity';
import { TaskAttachmentService } from '../services/task-attachment.service';
import { TaskService } from '../services/task.service';
import {
  createTaskDto,
  mockedTask,
  mockedTaskId,
  mockedTasks,
  mockedUpdatedTask,
  updateTaskDto,
} from './task.test-data';
import { mockedProjectId } from '../../project/tests/project.test-data';
import { mockedUser } from '../../user/tests/user.test-data';

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockedTasks),
    getRawMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
  })),
}));

describe('The TaskService', () => {
  let service: TaskService;
  let repositoryMock: MockType<Repository<TaskEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(TaskEntity), useFactory: repositoryMockFactory },
        { provide: ProjectService, useValue: mockedProjectService },
        { provide: UserService, useValue: mockedUserService },
        { provide: UserAvatarService, useValue: {} },
        { provide: TaskAttachmentService, useValue: {} },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repositoryMock = await module.get(getRepositoryToken(TaskEntity));
  });

  describe('createTask', () => {
    it('should create a new task record and return that', async () => {
      repositoryMock.save.mockResolvedValue(mockedTask);
      const createdTask = await service.createTask(createTaskDto, mockedUser);
      expect(createdTask).toEqual(mockedTask);
    });
  });

  describe('updateTask', () => {
    it('should update the task if ID exists and return updated Task', async () => {
      repositoryMock.findOne.mockResolvedValue(mockedUpdatedTask);
      repositoryMock.save.mockResolvedValue(mockedUpdatedTask);
      const updatedTask = await service.updateTask(updateTaskDto, mockedUser, mockedTaskId);
      expect(updatedTask).toEqual(mockedUpdatedTask);
    });

    it('should throw the "InternalServerErrorException" otherwise', () => {
      repositoryMock.findOne.mockResolvedValue(null);
      expect(service.fetchTask(mockedTaskId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteTask', () => {
    it('should return the taskId if ID exists', async () => {
      repositoryMock.findOne.mockResolvedValue(mockedTask);
      const deletedTask = await service.deleteTask(mockedUser.id, mockedTaskId);
      expect(deletedTask).toEqual({ id: mockedTaskId });
      expect(repositoryMock.delete).toHaveBeenCalledWith({ id: mockedTaskId });
    });
  });

  describe('fetchTask', () => {
    it('should return the task if ID exists', async () => {
      repositoryMock.findOne.mockResolvedValue(mockedTask);
      const fetchedTask = await service.fetchTask(mockedTaskId);
      expect(fetchedTask).toEqual(mockedTask);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: mockedTaskId },
        relations: ['attachments.task'],
      });
    });
  });

  describe('fetchProjectTasks', () => {
    it('should return the project tasks', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().orderBy().andWhere().getMany();
      const fetchedTasks = await service.fetchProjectTasks(mockedUser.id, mockedProjectId);
      expect(fetchedTasks).toEqual(mockedTasks);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('fetchUserTasks', () => {
    it('should return the user tasks', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().orderBy().andWhere().getMany();
      const fetchedTasks = await service.fetchUserTasks(mockedUser.id, mockedUser.id);
      expect(fetchedTasks).toEqual(mockedTasks);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('fetchAssignedTasks', () => {
    it('should return the assigned tasks', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().orderBy().andWhere().getMany();
      const fetchedTasks = await service.fetchAssignedTasks(mockedUser.id, mockedUser.id);
      expect(fetchedTasks).toEqual(mockedTasks);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
