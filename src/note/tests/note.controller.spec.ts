import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';

describe('NoteController', () => {
  let controller: NoteController;

  const mockNoteService = {
    createNote: jest.fn((createNoteDto, user) => {
      return {
        ...createNoteDto,
        id: uuidv4(),
        created_at: new Date(),
        is_completed: false,
      };
    }),
    getRequiredFormatNote: jest.fn((note) => {
      return {
        ...note,
        owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [NoteService],
    })
      .overrideProvider(NoteService)
      .useValue(mockNoteService)
      .compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a note', async () => {
    const dto = {
      description: 'text',
      color: '#ffffff',
      owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
    };
    const user = {
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

    const expectedNoteResponse = {
      data: {
        id: expect.any(String),
        created_at: expect.any(Date),
        is_completed: false,
        ...dto,
      },
    };

    const createdNote = await controller.createNote(dto, user);

    expect(createdNote).toEqual(expectedNoteResponse);
  });
});
