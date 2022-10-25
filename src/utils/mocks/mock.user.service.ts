import { mockedUser } from '../../../test/user.test-data';

export const mockedUserService = {
  fetchUserById: jest.fn((id) => {
    return mockedUser;
  }),
};
