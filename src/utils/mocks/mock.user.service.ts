import { mockedUser } from '../../user/tests/user.test-data';

export const mockedUserService = {
  fetchUserById: jest.fn((id) => mockedUser),
};
