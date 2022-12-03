import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { ValidationPipe422 } from '../src/shared/validation-pipe/validation-pipe422';
import { NoteEntity } from '../src/note/entities/note.entity';
import { NoteModule } from '../src/note/note.module';
import { NoteService } from '../src/note/note.service';
import {
  createNoteDto,
  createNoteInvalidDto,
  noteApiDto,
  updatedNoteApiDto,
  updateNoteDto,
  updateNoteMissingFieldDto,
} from '../src/note/tests/note.test-data';
import { mockedNoteService } from '../src/shared/mocks/mock.note.service';

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

  describe('GET /notes/:id', () => {
    it('should return 200 if the note is fetched', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: noteApiDto });
    });
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
        .send(createNoteInvalidDto)
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
        .send(updateNoteMissingFieldDto)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should return 200 if the note is deleted', async () => {
      const response = await request(app.getHttpServer())
        .delete('/notes/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: { id: expect.any(String) } });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
