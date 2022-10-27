import { mockedUserEmail, mockedUserId, mockedUserName } from '../../user/tests/user.test-data';
import { UserInfoApiDto } from '../dto/api-dto/user-info-api.dto';

export const mockedUserSession = {
  user_id: mockedUserId,
  access_token: '',
  refresh_token: '',
  token_type: 'Bearer',
  expires_in: expect.any(Number),
};

export const userInfoApiDto: UserInfoApiDto = {
  id: mockedUserId,
  email: mockedUserEmail,
  username: mockedUserName,
  avatar_url: '',
  user_session: mockedUserSession,
};
