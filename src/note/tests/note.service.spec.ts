import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NoteEntity } from '../entities/note.entity';
import { NoteService } from '../note.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn(),
}));

describe('The NoteService', () => {
  let service: NoteService;
  let repositoryMock: MockType<Repository<NoteEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: getRepositoryToken(NoteEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    repositoryMock = module.get(getRepositoryToken(NoteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchNote', () => {
    describe('when user note with ID exists', () => {
      it('should return the note object', async () => {
        const note = {
          id: 'af6191b2-46e2-43f1-9f09-c9593f5b09c0',
          created_at: new Date(),
          description: 'buy book',
          color: '#ffffff',
          is_completed: true,
          owner: { id: 'f60c913b-0859-4797-8dea-c07409ffcf0d' },
        };

        repositoryMock.findOneBy.mockReturnValue(note);

        const fetchedNote = await service.fetchNoteForEdit(note.owner.id, note.id);

        expect(fetchedNote).toEqual(note);
        expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: note.id });
      });
    });

    describe('otherwise', () => {
      it('should throw the "InternalServerErrorException"', async () => {
        const note = {
          id: 'af6191b2-46e2-43f1-9f09-c9593f5b09c0',
          owner: { id: 'f60c913b-0859-4797-8dea-c07409ffcf0d' },
        };

        repositoryMock.findOneBy.mockReturnValue(undefined);

        try {
          await service.fetchNoteForEdit(note.owner.id, note.id);
        } catch (err) {
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err.message).toEqual(`Entity NoteModel, id=${note.id} not found in the database`);
        }
      });
    });
  });
});
