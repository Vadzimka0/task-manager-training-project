import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RegisterDto } from '../../auth/dto/register.dto';
import {
  SPECIAL_ONE_PROJECT_COLOR,
  SPECIAL_ONE_PROJECT_NAME,
} from '../../common/constants/default-constants';
import { ProjectService } from '../../project/project.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly projectService: ProjectService,
  ) {}

  async fetchMembersBySearch(search: { query: string }): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .andWhere('users.username LIKE :query', {
        query: `%${search.query}%`,
      })
      .orderBy('users.created_at', 'DESC');

    const members = await queryBuilder.getMany();
    return members;
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new NotFoundException('User does not exist');
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  // async getByName(performer: string): Promise<UserEntity> {
  //   const user = await this.userRepository.findOneBy({ username: performer });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
  // }

  // async getAllUsers(): Promise<UserEntity[]> {
  //   return await this.userRepository.find();
  // }

  async fetchUserStatistics(userId: string, owner_id: string): Promise<any> {
    // ids matching

    const ownerTasksQueryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'projects')
      .leftJoinAndSelect('projects.tasks', 'tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .andWhere('project.owner_id = :id', { id: userId })
      .select('user.id')
      .addSelect('COUNT(tasks.id)', 'tasks_number')
      .groupBy('user.id');

    const createdTasksObject = await ownerTasksQueryBuilder.getRawMany();

    const completedTasksObject = await ownerTasksQueryBuilder
      .andWhere('tasks.is_completed = :isCompleted', { isCompleted: true })
      .getRawMany();

    const created_tasks = +createdTasksObject[0].tasks_number;
    const completed_tasks = +completedTasksObject[0].tasks_number;
    const events = `${((completed_tasks / created_tasks) * 100).toFixed(0)}%`;

    return {
      created_tasks,
      completed_tasks,
      events,
    };
  }

  async createUser(registerDto: RegisterDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, registerDto);
    const user = await this.userRepository.save(newUser);
    const createProjectDto = {
      title: SPECIAL_ONE_PROJECT_NAME,
      color: SPECIAL_ONE_PROJECT_COLOR,
      owner_id: user.id,
    };
    const project = await this.projectService.createProject(createProjectDto, user);
    project.owner = user;
    return user;
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

  async removeRefreshToken(email: string): Promise<any> {
    const user = await this.getByEmail(email);
    await this.userRepository.update(user.id, {
      refresh_token: null,
    });
  }

  async getMembersInstances(membersIds: string[]): Promise<UserEntity[]> {
    const currentMembers = [];
    for (const id of membersIds) {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException('User with this username does not exist', HttpStatus.NOT_FOUND);
      }
      currentMembers.push(user);
    }
    return currentMembers;
  }
}
