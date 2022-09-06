import { UserEntity } from '../entities/user.entity';

export type UserApiType = UserEntity & {
  avatar_url: string;
};
