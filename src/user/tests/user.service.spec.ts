import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteService } from '../../note/note.service';
import { ProjectService } from '../../project/project.service';
import { TaskService } from '../../task/services/task.service';
import { UserAvatarService } from '../../user/services';
import { UserService } from '../../user/services/user.service';
import { mockedProjectService, mockedUserAvatarService, MockType } from '../../shared/mocks';
import { UserEntity } from '../entities/user.entity';
import {
  mockedUser,
  mockedUserEmail,
  mockedUserId,
  mockedUserResponse,
  signUpDto,
} from './user.test-data';

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockedUser]),
  })),
}));

describe('The UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
        { provide: UserAvatarService, useValue: mockedUserAvatarService },
        { provide: ProjectService, useValue: mockedProjectService },
        { provide: NoteService, useValue: {} },
        { provide: TaskService, useValue: {} },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = await module.get(getRepositoryToken(UserEntity));
  });

  describe('createUser', () => {
    it('should create a new user record and return that', async () => {
      repositoryMock.save.mockResolvedValue(mockedUser);
      const createdUser = await service.createUser(signUpDto);
      expect(createdUser).toEqual(mockedUserResponse);
    });
  });

  describe('fetchUserById', () => {
    it('should return the user if ID exists', async () => {
      repositoryMock.findOne.mockResolvedValue(mockedUser);
      const fetchedUser = await service.fetchUserById(mockedUserId);
      expect(fetchedUser).toEqual(mockedUser);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: mockedUserId },
      });
    });

    it('should throw the "InternalServerErrorException" otherwise', () => {
      repositoryMock.findOne.mockResolvedValue(null);
      expect(service.fetchUserById(mockedUserId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('fetchUserByEmail', () => {
    it('should return the user if ID exists', async () => {
      repositoryMock.findOne.mockResolvedValue(mockedUser);
      const fetchedUser = await service.fetchUserByEmail(mockedUserEmail);
      expect(fetchedUser).toEqual(mockedUser);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: mockedUserEmail },
      });
    });
  });

  describe('fetchMembersBySearch', () => {
    it('should return the users by search query', async () => {
      repositoryMock.createQueryBuilder().andWhere().orderBy().getMany();
      const fetchedUsers = await service.fetchMembersBySearch({ query: 'name' });
      expect(fetchedUsers).toEqual([mockedUser]);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
