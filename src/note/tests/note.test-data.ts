import { v4 as uuidv4 } from 'uuid';

import { mockedUser, mockedUserId } from '../../../test/user.test-data';
import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from '../dto';
import { NoteEntity } from '../entities/note.entity';

export const mockNoteId = '3b4e9041-22d2-49eb-828a-b84919c7eff8';
const mockedNoteDescription = 'text';
const mockedNoteInvalidDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non rutrum libero, non fringilla ligula. Aliquam finibus dapibus metus non faucibus. Morbi id vehicula mauris. Maecenas at iaculis quam, at lobortis diam. Mauris placerat finibus bibendum. Donec ornare condimentum dolor, ac cursus erat volutpat ut. Aenean luctus vitae nibh eget fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur ullamcorper efficitur finibus. Nullam varius consequat fusce.';
const mockedNoteColor = '#ffffff';

export const createNoteDto: CreateNoteDto = {
  description: mockedNoteDescription,
  color: mockedNoteColor,
  owner_id: mockedUserId,
};

export const createNoteInvalidDto: CreateNoteDto = {
  ...createNoteDto,
  description: mockedNoteInvalidDescription,
};

export const updateNoteDto: UpdateNoteDto = {
  ...createNoteDto,
  is_completed: true,
};

export const updateNoteMissingFieldDto = {
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

export const mockedNote: Partial<NoteEntity> = {
  id: uuidv4(),
  created_at: new Date(),
  is_completed: false,
  description: mockedNoteDescription,
  color: mockedNoteColor,
  owner: mockedUser,
};

export const mockedUpdatedNote: Partial<NoteEntity> = {
  ...mockedNote,
  is_completed: true,
};

export const mockedNotes: Partial<NoteEntity>[] = [mockedNote];
