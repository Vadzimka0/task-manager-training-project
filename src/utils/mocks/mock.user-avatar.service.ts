import { mockedUserResponse } from '../../user/tests/user.test-data';

export const mockedUserAvatarService = {
  getRequiredFormatUser: jest.fn((_) => mockedUserResponse),
};
