import { UserEntity } from '../src/user/entities/user.entity';

export const mockedUserId = 'f60c913b-0859-4797-8dea-c07409ffcf0d';

export const mockedUser: UserEntity = {
  id: mockedUserId,
  email: 'f60c913b@gmail.com',
  username: 'f60c913b',
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
