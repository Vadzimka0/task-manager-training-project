import { Request } from 'express';

import { UserEntity } from '../../user/entities/user.entity';

export type ExpressRequestType = Request & {
  user?: UserEntity;
};
