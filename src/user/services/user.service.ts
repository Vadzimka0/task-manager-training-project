import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { SignUpDto } from '../../auth/dto/sign-up.dto';
import {
  SPECIAL_ONE_PROJECT_COLOR,
  SPECIAL_ONE_PROJECT_NAME,
} from '../../shared/constants/default-constants';
import { MessageEnum } from '../../shared/enums/messages.enum';
import { NoteService } from '../../note/note.service';
import { ProjectService } from '../../project/project.service';
import { TaskService } from '../../task/services';
import { UserEntity } from '../entities/user.entity';
import { UserApiType } from '../types/user-api.type';
import { UserStatisticsApiType } from '../types/user-statistics-api.type';
import { UserAvatarService } from './user-avatar.service';

@Injectable()
export class UserService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userAvatarService: UserAvatarService,
    private readonly projectService: ProjectService,
    private readonly noteService: NoteService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {}

  /**
   * A method that fetches users from the database (search by username)
   * @param search An object with property of query string of a URL
   */
  async fetchMembersBySearch(search: { query: string }): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .andWhere('users.username LIKE :query', {
        query: `%${search.query}%`,
      })
      .orderBy('users.created_at', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * A method that receives the statistics by user
   * @param userId An userId from JWT
   * @param owner_id An owner_id from URI Parameters
   */
  async getUserStatistics(userId: string, owner_id: string): Promise<UserStatisticsApiType> {
    if (userId !== owner_id) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID_STATISTICS_ONLY_TO_YOU);
    }

    const { created_tasks, completed_tasks } = await this.taskService.fetchTasksStatisticsByOwner(
      userId,
    );
    const events = created_tasks
      ? `${((completed_tasks / created_tasks) * 100).toFixed(0)}%`
      : '0%';

    const quick_notes = await this.noteService.fetchQuickNotesStatisticsByOwner(userId);

    const todo = await this.taskService.fetchTodoStatisticsByPerformer(userId);

    return {
      created_tasks,
      completed_tasks,
      events,
      quick_notes,
      todo,
    };
  }

  /**
   * A method that fetches an user by id from the database
   * @param id An id of user
   */
  async fetchUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      return user;
    }

    // throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    throw new InternalServerErrorException(`Entity UserModel, id=${id} not found in the database`);
  }

  /**
   * A method that fetches an user by email from the database
   * @param email An email of user
   */
  async fetchUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      return user;
    }

    throw new UnprocessableEntityException('The user email is not valid');
  }

  /**
   * A method that creates an user with 'Personal' project in the database
   */
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

    return this.userAvatarService.getRequiredFormatUser(user as UserApiType);
  }

  /**
   * A method that updates refresh token in the database
   */
  async setCurrentRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refresh_token: currentRefreshToken,
    });
  }

  /**
   * A method that returns user if refresh token matches
   */
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<UserEntity> {
    const user = await this.fetchUserByEmail(email);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refresh_token);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException(MessageEnum.INVALID_REFRESH_TOKEN);
    }

    return user;
  }

  /**
   * A method that nullifies user refresh token
   */
  async removeRefreshToken(email: string): Promise<void> {
    const user = await this.fetchUserByEmail(email);
    await this.userRepository.update(user.id, {
      refresh_token: null,
    });
  }

  /**
   * A method that returns list of users
   * @param membersIds List of users identifiers
   * @returns A promise with the list of users
   */
  async getMembersInstances(membersIds: string[]): Promise<UserApiType[]> {
    const currentMembers = [];

    for (const id of membersIds) {
      const user = await this.fetchUserById(id);
      currentMembers.push(user);
    }

    return currentMembers;
  }
}
