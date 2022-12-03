import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { ValidationPipe422 } from '../src/shared/validation-pipe/validation-pipe422';
import { NoteEntity } from '../src/note/entities/note.entity';
import { ProjectEntity } from '../src/project/entities/project.entity';
import {
  CommentAttachmentEntity,
  CommentEntity,
  TaskAttachmentEntity,
  TaskEntity,
} from '../src/task/entities';
import {
  CommentAttachmentService,
  CommentService,
  TaskAttachmentService,
  TaskService,
} from '../src/task/services';
import { TaskModule } from '../src/task/task.module';
import {
  commentApiDto,
  createCommentDto,
  createCommentInvalidDto,
} from '../src/task/tests/comment.test-data';
import {
  createTaskDto,
  createTaskInvalidDto,
  taskApiDto,
  updatedTaskApiDto,
  updateTaskDto,
  updateTaskMissingFieldDto,
} from '../src/task/tests/task.test-data';
import { UserEntity } from '../src/user/entities/user.entity';
import { UserAvatarService, UserService } from '../src/user/services';
import { mockedCommentService, mockedTaskService } from '../src/shared/mocks';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TaskModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideProvider(getRepositoryToken(TaskEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(CommentEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(TaskAttachmentEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(CommentAttachmentEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(UserEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(ProjectEntity))
    .useValue({})
    .overrideProvider(getRepositoryToken(NoteEntity))
    .useValue({})
    .overrideProvider(TaskService)
    .useValue(mockedTaskService)
    .overrideProvider(CommentService)
    .useValue(mockedCommentService)
    .overrideProvider(TaskAttachmentService)
    .useValue({})
    .overrideProvider(CommentAttachmentService)
    .useValue({})
    .overrideProvider(UserService)
    .useValue({})
    .overrideProvider(UserAvatarService)
    .useValue({})
    .overrideProvider(ConfigService)
    .useValue({})
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe422());
  await app.init();
});

describe('TaskController (e2e):', () => {
  describe('GET /tasks/:id', () => {
    it('should return 200 if the task is fetched', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: taskApiDto });
    });
  });

  describe('POST /tasks', () => {
    it('should return 200 if the task is created', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: taskApiDto });
    });

    it('should return 422 if the title is longer than 256 characters.', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskInvalidDto)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should return 200 if the task is updated', async () => {
      const response = await request(app.getHttpServer())
        .put('/tasks/:id')
        .send(updateTaskDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: updatedTaskApiDto });
    });

    it('should return 422 if any of the required fields is missing', async () => {
      return request(app.getHttpServer())
        .put('/tasks/:id')
        .send(updateTaskMissingFieldDto)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should return 200 if the task is deleted', async () => {
      const response = await request(app.getHttpServer())
        .delete('/tasks/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: { id: expect.any(String) } });
    });
  });
});

describe('CommentController (e2e):', () => {
  describe('GET /tasks-comments/:id', () => {
    it('should return 200 if the comments is fetched', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks-comments/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: [commentApiDto] });
    });
  });

  describe('POST /comments', () => {
    it('should return 200 if the comment is created', async () => {
      const response = await request(app.getHttpServer())
        .post('/comments')
        .send(createCommentDto)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: commentApiDto });
    });

    it('should return 422 if the content is longer than 1024 characters.', async () => {
      return request(app.getHttpServer())
        .post('/comments')
        .send(createCommentInvalidDto)
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should return 200 if the comment is deleted', async () => {
      const response = await request(app.getHttpServer())
        .delete('/comments/:id')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(response.body).toEqual({ data: { id: expect.any(String) } });
    });
  });
});

afterAll(async () => {
  await app.close();
});
