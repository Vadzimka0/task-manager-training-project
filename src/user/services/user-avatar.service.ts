import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserAvatarService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addAvatar(
    user: UserEntity,
    user_id: string,
    filedata: any,
    // ): Promise<TaskAttachmentApiType> {
  ): Promise<UserEntity> {
    // check id's matching

    Object.assign(user, filedata);

    return await this.userRepository.save(user);
  }
}
