import { UserEntity } from '../../user/entities/user.entity';
import { UserSession } from './userSession.interface';

export type Register = UserEntity & { user_session: UserSession };
