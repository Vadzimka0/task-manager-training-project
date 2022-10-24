import { Test, TestingModule } from '@nestjs/testing';

import { mockedUser } from '../../../test/user.test-data';
import { mockedNoteService } from '../../utils/mocks/mock.note.service';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';
import { createNoteDto, noteApiDto } from './note.test-data';

describe('NoteController', () => {
  let controller: NoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [NoteService],
    })
      .overrideProvider(NoteService)
      .useValue(mockedNoteService)
      .compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should create a note', async () => {
    const createdNote = await controller.createNote(createNoteDto, mockedUser);
    expect(createdNote).toEqual({ data: noteApiDto });
  });
});
