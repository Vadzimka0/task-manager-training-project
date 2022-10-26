import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { mockedUser } from '../../../test/user.test-data';
import { UserAvatarService } from '../../user/services';
import { mockedTaskService, MockType } from '../../utils/mocks';
import { CommentEntity } from '../entities/comment.entity';
import { CommentAttachmentService, CommentService, TaskService } from '../services';
import {
  createCommentDto,
  mockedComment,
  mockedCommentId,
  mockedComments,
} from './comment.test-data';
import { mockedTaskId } from './task.test-data';

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
    getMany: jest.fn().mockResolvedValue(mockedComments),
  })),
}));

describe('The CommentService', () => {
  let service: CommentService;
  let repositoryMock: MockType<Repository<CommentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
        { provide: TaskService, useValue: mockedTaskService },
        { provide: UserAvatarService, useValue: {} },
        { provide: CommentAttachmentService, useValue: {} },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repositoryMock = await module.get(getRepositoryToken(CommentEntity));
  });

  describe('createComment', () => {
    it('should create a new comment record and return that', async () => {
      repositoryMock.save.mockResolvedValue(mockedComment);
      const createdComment = await service.createComment(createCommentDto, mockedUser);
      expect(createdComment).toEqual(mockedComment);
    });
  });

  describe('deleteComment', () => {
    it('should return the commentId if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockedComment);
      const deletedTask = await service.deleteComment(mockedUser.id, mockedCommentId);
      expect(deletedTask).toEqual({ id: mockedCommentId });
      expect(repositoryMock.delete).toHaveBeenCalledWith({ id: mockedCommentId });
    });

    it('should throw the "InternalServerErrorException" otherwise', () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      expect(service.deleteComment(mockedUser.id, mockedCommentId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('fetchTaskComments', () => {
    it('should return the task comments', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().andWhere().orderBy().getMany();
      const fetchedComments = await service.fetchTaskComments(mockedTaskId);
      expect(fetchedComments).toEqual(mockedComments);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
