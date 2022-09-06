import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserApiType } from '../types/user-api.type';

@Injectable()
export class UserAvatarService {
  private server_url: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}/${this.configService.get(
      'URL_PREFIX_PATH',
    )}/`;
  }

  async addAvatar(
    user: UserEntity,
    addAvatarDto: { user_id: string },
    file: any,
  ): Promise<UserApiType> {
    if (user.id !== addAvatarDto.user_id) {
      throw new UnprocessableEntityException(
        'The avatar could not be attached to user. The user is not found.',
      );
    }

    const filedata = {
      path: file.path,
      mimetype: file.mimetype,
      filename: file.originalname,
    };

    Object.assign(user, filedata);

    const savedUser = await this.userRepository.save(user);
    return this.getUserWithAvatarId(savedUser as UserApiType);
  }

  getUserWithAvatarId(user: UserApiType): UserApiType {
    user.avatar_url = `${this.server_url}${user.path.substring(user.path.indexOf('/') + 1)}`;
    return user;
  }
}
