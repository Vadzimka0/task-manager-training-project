import { UserApiType } from '../../user/types/user-api.type';
import { UserSessionApiType } from './user-session-api.type';

export type UserInfoApiType = UserApiType & {
  user_session: UserSessionApiType;
};
