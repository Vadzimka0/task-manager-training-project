import { forwardRef, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { SignUpDto } from '../../auth/dto/sign-up.dto';
import {
  SPECIAL_ONE_PROJECT_COLOR,
  SPECIAL_ONE_PROJECT_NAME,
} from '../../common/constants/default-constants';
import { NoteService } from '../../note/note.service';
import { ProjectService } from '../../project/project.service';
import { TaskService } from '../../task/services';
import { UserEntity } from '../entities/user.entity';
import { UserApiType } from '../types/user-api.type';
import { UserStatisticsApiType } from '../types/user-statistics-api.type';
import { UserAvatarService } from './user-avatar.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userAvatarService: UserAvatarService,
    private readonly projectService: ProjectService,
    private readonly noteService: NoteService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {}

  async fetchUser(id: string): Promise<UserApiType> {
    const user = await this.getById(id);
    return this.userAvatarService.getUserWithAvatarUrl(user as UserApiType);
  }

  async fetchMembersBySearch(search: { query: string }): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .andWhere('users.username LIKE :query', {
        query: `%${search.query}%`,
      })
      .orderBy('users.created_at', 'DESC');

    const members = await queryBuilder.getMany();
    return members.map((user) => this.userAvatarService.getUserWithAvatarUrl(user as UserApiType));
  }

  async fetchUserStatistics(userId: string, owner_id: string): Promise<UserStatisticsApiType> {
    if (userId !== owner_id) {
      throw new UnprocessableEntityException(
        'The user id is not valid. Statistics are available only to you.',
      );
    }

    const { created_tasks, completed_tasks } = await this.taskService.getTasksStatisticsByOwner(
      userId,
    );
    const events = created_tasks
      ? `${((completed_tasks / created_tasks) * 100).toFixed(0)}%`
      : '0%';

    const quick_notes = await this.noteService.getQuickNotesStatisticsByOwner(userId);

    const todo = await this.taskService.getTodoStatisticsByPerformer(userId);

    return {
      created_tasks,
      completed_tasks,
      events,
      quick_notes,
      todo,
    };
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new UnprocessableEntityException('The user id is not valid');
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new UnprocessableEntityException('The user email is not valid');
  }

  async createUser(signUpDto: SignUpDto): Promise<UserApiType> {
    const newUser = new UserEntity();
    Object.assign(newUser, signUpDto);
    const user = await this.userRepository.save(newUser);
    const createProjectDto = {
      title: SPECIAL_ONE_PROJECT_NAME,
      color: SPECIAL_ONE_PROJECT_COLOR,
      owner_id: user.id,
    };
    const project = await this.projectService.createProject(createProjectDto, user);
    project.owner = user;

    delete user.created_at;
    return this.userAvatarService.getUserWithAvatarUrl(user as UserApiType);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refresh_token: currentRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<UserEntity> {
    const user = await this.getByEmail(email);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refresh_token);
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(email: string): Promise<void> {
    const user = await this.getByEmail(email);
    await this.userRepository.update(user.id, {
      refresh_token: null,
    });
  }

  async getMembersInstances(membersIds: string[]): Promise<UserApiType[]> {
    const currentMembers = [];
    for (const id of membersIds) {
      const user = await this.getById(id);
      currentMembers.push(user);
    }
    return currentMembers;
  }
}
