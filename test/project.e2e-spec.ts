import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { ValidationPipe422 } from '../src/common/validation-pipe/validation-pipe422';
import { ProjectEntity } from '../src/project/entities/project.entity';
import { ProjectModule } from '../src/project/project.module';
import { ProjectService } from '../src/project/project.service';
import {
  createProjectDto,
  createProjectDto2,
  projectApiDto,
  updatedProjectApiDto,
  updateProjectDto,
  updateProjectDto2,
} from '../src/project/tests/project.test-data';
import { mockedProjectService } from '../src/utils/mocks';

describe('ProjectController (e2e):', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getRepositoryToken(ProjectEntity))
      .useValue({})
      .overrideProvider(ProjectService)
      .useValue(mockedProjectService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe422());
    await app.init();
  });

  describe('GET /projects/:id', () => {
    it('should return 200 if the project is fetched', async () => {
      const response = await request(app.getHttpServer())
        .get('/projects/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: projectApiDto });
    });
  });

  describe('POST /projects', () => {
    it('should return 200 if the project is created', async () => {
      const response = await request(app.getHttpServer())
        .post('/projects')
        .send(createProjectDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: projectApiDto });
    });

    it('should return 422 if the title is longer than 32 characters.', async () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send(createProjectDto2)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('PUT /projects/:id', () => {
    it('should return 200 if the project is updated', async () => {
      const response = await request(app.getHttpServer())
        .put('/projects/:id')
        .send(updateProjectDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: updatedProjectApiDto });
    });

    it('should return 422 if any of the required fields is missing', async () => {
      return request(app.getHttpServer())
        .put('/projects/:id')
        .send(updateProjectDto2)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should return 200 if the project is deleted', async () => {
      const response = await request(app.getHttpServer())
        .delete('/projects/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: { id: expect.any(String) } });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
