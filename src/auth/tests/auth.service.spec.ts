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
import mockedConfigService from '../../utils/mocks/mock.config.service';
import mockedJwtService from '../../utils/mocks/mock.jwt.service';
import { AuthService } from '../auth.service';

describe('The AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
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

  describe('when creating a token', () => {
    it('should return a string', () => {
      const email = 'test@example.com';
      expect(typeof authService.getJwtAccessToken(email)).toEqual('string');
    });
  });
});
