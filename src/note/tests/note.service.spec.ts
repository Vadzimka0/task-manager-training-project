import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from '../../user/entities/user.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteEntity } from '../entities/note.entity';
import { NoteService } from '../note.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
}));

describe('The NoteService', () => {
  let service: NoteService;
  let repositoryMock: MockType<Repository<NoteEntity>>;

  const user: UserEntity = {
    id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
    email: 'f60c913b@gmail.com',
    username: 'f60c913b',
    created_at: undefined,
    password: '',
    refresh_token: '',
    notes: [],
    checklists: [],
    projects: [],
    assigned_tasks: [],
    participate_tasks: [],
    comments: [],
    mimetype: '',
    path: '',
    filename: '',
  };
  const expectedNote: Partial<NoteEntity> = {
    id: uuidv4(),
    created_at: new Date(),
    description: 'text',
    color: '#ffffff',
    is_completed: false,
    owner: user,
  };

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

  describe('createNote', () => {
    it('should create a new note record and return that', async () => {
      const dto: CreateNoteDto = {
        description: 'text',
        color: '#ffffff',
        owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
      };

      repositoryMock.save.mockReturnValue(expectedNote);

      const createdNote = await service.createNote(dto, user);

      expect(createdNote).toEqual(expectedNote);
    });
  });

  describe('fetchNote', () => {
    describe('when user note with ID exists', () => {
      it('should return the note object', async () => {
        repositoryMock.findOneBy.mockReturnValue(expectedNote);

        const fetchedNote = await service.fetchNoteForEdit(expectedNote.owner.id, expectedNote.id);

        expect(fetchedNote).toEqual(expectedNote);
        expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: expectedNote.id });
      });
    });

    describe('otherwise', () => {
      it('should throw the "InternalServerErrorException"', async () => {
        repositoryMock.findOneBy.mockReturnValue(undefined);

        try {
          await service.fetchNoteForEdit(expectedNote.owner.id, expectedNote.id);
        } catch (err) {
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err.message).toEqual(
            `Entity NoteModel, id=${expectedNote.id} not found in the database`,
          );
        }
      });
    });
  });
});
