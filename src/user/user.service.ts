import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, UpdateResult } from 'typeorm';

import {
  SPECIAL_ONE_PROJECT_COLOR,
  SPECIAL_ONE_PROJECT_NAME,
} from '../common/constants/default-constants';
import { ProjectService } from '../project/project.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly projectService: ProjectService,
  ) {}

  async fetchMembersBySearch(
    userId: string,
    search: { query: string },
    // ): Promise<ProjectApiType[]> {
  ): Promise<any> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .andWhere('users.username LIKE :query', {
        query: `%${search.query}%`,
      })
      .orderBy('users.created_at', 'DESC');

    const members = await queryBuilder.getMany();
    // const projectsWithOwnerId = members.map((project: ProjectApiType) =>
    // this.getProjectWithOwnerId(project),
    // );
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

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async createUser(registerDto: CreateUserDto): Promise<UserEntity> {
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

  async setCurrentRefreshToken(refresh_token: string, userId: string): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<UserEntity> {
    const user = await this.getByEmail(email);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(email: string): Promise<any> {
    const user = await this.getByEmail(email);
    await this.userRepository.update(user.id, {
      currentHashedRefreshToken: null,
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
