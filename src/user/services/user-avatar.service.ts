import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarMessageEnum } from '../../common/enums/messages.enum';

import { AddAvatarDto } from '../dto/add-avatar.dto';
import { UserEntity } from '../entities/user.entity';
import { UserApiType } from '../types/user-api.type';

@Injectable()
export class UserAvatarService {
  private server_url: string;

  /**
   * @ignore
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}/${this.configService.get(
      'URL_PREFIX_PATH',
    )}/`;
  }

  /**
   * A method that adds an avatar in the database
   * @param user An user from JWT
   */
  async addAvatar(
    user: UserEntity,
    addAvatarDto: AddAvatarDto,
    file: Express.Multer.File,
  ): Promise<UserApiType> {
    if (user.id !== addAvatarDto.user_id) {
      throw new UnprocessableEntityException(AvatarMessageEnum.AVATAR_COULD_NOT_BE_ATTACHED);
    }

    const filedata = {
      path: file.path,
      mimetype: file.mimetype,
      filename: file.originalname,
    };

    Object.assign(user, filedata);
    const savedUser = await this.userRepository.save(user);

    return this.getRequiredFormatUser(savedUser as UserApiType);
  }

  /**
   * A method that adds the avatar_url property to User according to the requirements
   */
  getRequiredFormatUser(user: UserApiType): UserApiType {
    user.avatar_url = user.path
      ? `${this.server_url}${user.path.substring(user.path.indexOf('/') + 1)}`
      : null;

    return user;
  }
}
