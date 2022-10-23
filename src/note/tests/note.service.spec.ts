import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  createNoteDto,
  mockNoteId,
  noteEntities,
  noteEntity,
  updateNoteDto,
} from './note.test-data';
import { mockedUser } from '../../../test/user.test-data';
import { NoteEntity } from '../entities/note.entity';
import { NoteService } from '../note.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(noteEntities),
  })),
}));

describe('The NoteService', () => {
  let service: NoteService;
  let repositoryMock: MockType<Repository<NoteEntity>>;

  const entityNotExists = () => {
    repositoryMock.findOneBy.mockResolvedValue(null);
    expect(service.fetchNoteForEdit(mockedUser.id, mockNoteId)).rejects.toThrow(
      InternalServerErrorException,
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: getRepositoryToken(NoteEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    repositoryMock = await module.get(getRepositoryToken(NoteEntity));
  });

  describe('createNote', () => {
    it('should create a new note record and return that', async () => {
      repositoryMock.save.mockResolvedValue(noteEntity);
      const createdNote = await service.createNote(createNoteDto, mockedUser);
      expect(createdNote).toEqual(noteEntity);
    });

    it('should throw the "UnprocessableEntityException" if color is not valid', async () => {
      const createNoteInvalidDto = { ...createNoteDto, color: 'black' };
      expect(service.createNote(createNoteInvalidDto, mockedUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updateNote', () => {
    it('should update the note if ID exists and return updated note', async () => {
      repositoryMock.findOneBy.mockResolvedValue(noteEntity);
      repositoryMock.save.mockResolvedValue(noteEntity);
      const updatedNote = await service.updateNote(updateNoteDto, mockedUser.id, mockNoteId);
      expect(updatedNote).toEqual(noteEntity);
    });

    it('should throw the "InternalServerErrorException" otherwise', entityNotExists);
  });

  describe('deleteNote', () => {
    it('should return the noteId if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(noteEntity);
      const deletedNote = await service.deleteNote(mockedUser.id, mockNoteId);
      expect(deletedNote).toEqual({ id: mockNoteId });
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockNoteId });
    });

    it('should throw the "InternalServerErrorException" otherwise', entityNotExists);
  });

  describe('fetchOneNote', () => {
    it('should return the note if ID exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(noteEntity);
      const fetchedNote = await service.fetchOneNote(mockedUser.id, mockNoteId);
      expect(fetchedNote).toEqual(noteEntity);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockNoteId });
    });

    it('should throw the "UnprocessableEntityException" otherwise', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      expect(service.fetchOneNote(mockedUser.id, mockNoteId)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('fetchUserNotes', () => {
    it('should return the user notes ', async () => {
      repositoryMock.createQueryBuilder().leftJoinAndSelect().andWhere().orderBy().getMany();
      const fetchedNotes = await service.fetchUserNotes(mockedUser.id, mockedUser.id);
      expect(fetchedNotes).toEqual(noteEntities);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
