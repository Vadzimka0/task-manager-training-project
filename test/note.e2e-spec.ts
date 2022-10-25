import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { ValidationPipe422 } from '../src/common/validation-pipe/validation-pipe422';
import { NoteEntity } from '../src/note/entities/note.entity';
import { NoteModule } from '../src/note/note.module';
import { NoteService } from '../src/note/note.service';
import {
  createNoteDto,
  createNoteDto2,
  noteApiDto,
  updatedNoteApiDto,
  updateNoteDto,
  updateNoteDto2,
} from '../src/note/tests/note.test-data';
import { mockedNoteService } from '../src/utils/mocks/mock.note.service';

describe('NoteController (e2e):', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NoteModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getRepositoryToken(NoteEntity))
      .useValue({})
      .overrideProvider(NoteService)
      .useValue(mockedNoteService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe422());
    await app.init();
  });

  describe('POST /notes', () => {
    it('should return 200 if the note is created', async () => {
      const response = await request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: noteApiDto });
    });

    it('should return 422 if the description is longer than 512 characters.', async () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto2)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should return 200 if the note is updated', async () => {
      const response = await request(app.getHttpServer())
        .put('/notes/:id')
        .send(updateNoteDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: updatedNoteApiDto });
    });

    it('should return 422 if any of the required fields is missing', async () => {
      return request(app.getHttpServer())
        .put('/notes/:id')
        .send(updateNoteDto2)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
