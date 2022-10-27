import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NoteService } from '../../note/note.service';
import { ProjectService } from '../../project/project.service';
import { TaskService } from '../../task/services/task.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserAvatarService } from '../../user/services/user-avatar.service';
import { UserService } from '../../user/services/user.service';
import { mockedUser, mockedUserId } from '../../user/tests/user.test-data';
import { mockedConfigService, mockedJwtService, mockedUserService } from '../../utils/mocks';
import { AuthService } from '../auth.service';

describe('The AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: UserAvatarService, useValue: {} },
        { provide: ProjectService, useValue: {} },
        { provide: NoteService, useValue: {} },
        { provide: TaskService, useValue: {} },
      ],
    }).compile();

    authService = await module.get(AuthService);
  });

  describe('getJwtAccessToken', () => {
    it('should return a string when creating a token', () => {
      const email = 'test@example.com';
      expect(typeof authService.getJwtAccessToken(email)).toEqual('string');
    });
  });

  describe('getUserSessionInfo', () => {
    it('should return user_id, tokens, token_type, and expires_in', async () => {
      const info = await authService.getUserSessionInfo(mockedUser);
      expect(info).toEqual({
        user_id: mockedUserId,
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        token_type: 'Bearer',
        expires_in: expect.any(Number),
      });
    });
  });
});
