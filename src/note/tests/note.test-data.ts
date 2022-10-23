import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from '../dto';
import { NoteEntity } from '../entities/note.entity';
import { mockedUser, mockedUserId } from '../../../test/user.test-data';

export const mockNoteId = '3b4e9041-22d2-49eb-828a-b84919c7eff8';

export const createNoteDto: CreateNoteDto = {
  description: 'text',
  color: '#ffffff',
  owner_id: mockedUserId,
};

export const createNoteDto2: CreateNoteDto = {
  ...createNoteDto,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non rutrum libero, non fringilla ligula. Aliquam finibus dapibus metus non faucibus. Morbi id vehicula mauris. Maecenas at iaculis quam, at lobortis diam. Mauris placerat finibus bibendum. Donec ornare condimentum dolor, ac cursus erat volutpat ut. Aenean luctus vitae nibh eget fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur ullamcorper efficitur finibus. Nullam varius consequat fusce.',
};

export const updateNoteDto: UpdateNoteDto = {
  ...createNoteDto,
  is_completed: true,
};

export const updateNoteDto2 = {
  ...createNoteDto,
};

export const noteApiDto: Partial<NoteApiDto> = {
  ...createNoteDto,
  id: expect.any(String),
  created_at: expect.any(String),
  is_completed: false,
};

export const updatedNoteApiDto: Partial<NoteApiDto> = {
  ...noteApiDto,
  is_completed: true,
};

export const noteEntity: Partial<NoteEntity> = {
  id: expect.any(String),
  created_at: expect.any(String),
  is_completed: false,
  description: 'text',
  color: '#ffffff',
  owner: mockedUser,
};

export const noteEntities = [
  {
    id: expect.any(String),
    created_at: expect.any(String),
    is_completed: false,
    description: 'text',
    color: '#ffffff',
    owner: mockedUser,
  },
];
