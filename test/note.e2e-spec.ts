import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import JwtAuthGuard from '../src/auth/guards/jwt-auth.guard';
import { CreateNoteDto } from '../src/note/dto';
import { NoteEntity } from '../src/note/entities/note.entity';
import { NoteModule } from '../src/note/note.module';
import { NoteService } from '../src/note/note.service';

describe('NoteController (e2e)', () => {
  let app: INestApplication;

  const mockNoteRepository = {};
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

  const dto: CreateNoteDto = {
    description: 'text',
    color: '#ffffff',
    owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  };
  const dtoInvalid = {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non rutrum libero, non fringilla ligula. Aliquam finibus dapibus metus non faucibus. Morbi id vehicula mauris. Maecenas at iaculis quam, at lobortis diam. Mauris placerat finibus bibendum. Donec ornare condimentum dolor, ac cursus erat volutpat ut. Aenean luctus vitae nibh eget fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur ullamcorper efficitur finibus. Nullam varius consequat fusce.',
    color: '#ffffff',
    owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NoteModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getRepositoryToken(NoteEntity))
      .useValue(mockNoteRepository)
      .overrideProvider(NoteService)
      .useValue(mockNoteService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/notes (POST) --> 200', async () => {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send(dto)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toEqual({
      data: {
        description: 'text',
        color: '#ffffff',
        id: expect.any(String),
        created_at: expect.any(String),
        is_completed: false,
        owner_id: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
      },
    });
  });

  it('/notes (POST) --> 400 on validation error / description is longer than 512 characters.', async () => {
    return request(app.getHttpServer())
      .post('/notes')
      .send(dtoInvalid)
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
