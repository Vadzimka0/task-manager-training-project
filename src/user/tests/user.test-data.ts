import { SignInDto } from '../../auth/dto/sign-in.dto';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { UserEntity } from '../entities/user.entity';
import { UserApiType } from '../types/user-api.type';

export const mockedUserId = 'f60c913b-0859-4797-8dea-c07409ffcf0d';
export const mockedUserEmail = 'mockedemail@mail.com';
export const mockedUserName = 'mockedusername';

export const signUpDto: SignUpDto = {
  email: mockedUserEmail,
  password: 'mockedpassword',
  username: mockedUserName,
};

export const signInDto: SignInDto = {
  email: mockedUserEmail,
  password: 'mockedpassword',
};

export const mockedUser: UserEntity = {
  id: mockedUserId,
  email: 'f60c913b@gmail.com',
  username: 'name_f60c913b',
  created_at: undefined,
  password: '',
  refresh_token: '',
  notes: [],
  checklists: [],
  projects: [],
  assigned_tasks: [],
  participate_tasks: [],
  comments: [],
  mimetype: '',
  path: '',
  filename: '',
};

export const mockedUserResponse: UserApiType = {
  ...mockedUser,
  avatar_url: '',
};
