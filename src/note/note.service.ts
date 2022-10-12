import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageEnum, NoteMessageEnum } from '../common/enums/messages.enum';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';

@Injectable()
export class NoteService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  /**
   * A method that fetches user notes from the database
   * @param userId An userId from JWT
   * @param ownerId An ownerId from request body
   */
  async fetchUserNotes(userId: string, ownerId: string): Promise<NoteApiDto[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .andWhere('notes.owner_id = :id', { id: userId })
      .orderBy('notes.created_at', 'ASC');

    const notes = await queryBuilder.getMany();

    return notes.map((note: NoteApiDto) => this.getRequiredFormatNote(note));
  }

  /**
   * A method that returns one note in the required format
   * @param userId An userId from JWT
   * @param noteId A noteId of a note. A note with this id should exist in the database
   */
  async getNote(userId: string, noteId: string): Promise<NoteApiDto> {
    const note = await this.fetchNoteForRead(userId, noteId);

    return this.getRequiredFormatNote(note as NoteApiDto);
  }

  /**
   * A method that creates a note in the database
   * @param currentUser An user from JWT
   */
  async createNote(createNoteDto: CreateNoteDto, currentUser: UserEntity): Promise<NoteApiDto> {
    this.validateHexColor(createNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = createNoteDto;
    this.idsMatching(owner_id, currentUser.id);

    const newNote = new NoteEntity();
    Object.assign(newNote, dtoWithoutOwner);
    newNote.owner = currentUser;
    const savedNote = await this.noteRepository.save(newNote);

    return this.getRequiredFormatNote(savedNote as NoteApiDto);
  }

  /**
   * A method that updates a note in the database
   * @param userId An userId from JWT
   * @param noteId A noteId of a note. A note with this id should exist in the database
   */
  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: string,
    noteId: string,
  ): Promise<NoteApiDto> {
    this.validateHexColor(updateNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = updateNoteDto;
    this.idsMatching(owner_id, userId);

    const currentNote = await this.fetchNoteForEdit(userId, noteId);
    Object.assign(currentNote, dtoWithoutOwner);
    const savedNote = await this.noteRepository.save(currentNote);

    return this.getRequiredFormatNote(savedNote as NoteApiDto);
  }

  /**
   * A method that deletes a note from the database
   * @param userId An userId from JWT
   * @param noteId A noteId of a note. A note with this id should exist in the database
   * @returns A promise with the id of deleted note
   */
  async deleteNote(userId: string, noteId: string): Promise<{ id: string }> {
    await this.fetchNoteForEdit(userId, noteId);
    await this.noteRepository.delete({ id: noteId });

    return { id: noteId };
  }

  /**
   * A method that fetches a note from the database for GET requests. If the note does not exist, the 422 error will be thrown according to the requirements
   * @param userId An userId from JWT
   * @param noteId A noteId of a note. A note with this id should exist in the database
   */
  async fetchNoteForRead(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneBy({ id: noteId });

    if (!note || note.owner.id !== userId) {
      throw new UnprocessableEntityException(NoteMessageEnum.INVALID_NOTE_ID);
    }

    return note;
  }

  /**
   * A method that fetches a note from the database for POST and DELETE requests. If the note does not exist, the 500 error will be thrown according to the requirements
   * @param userId An userId from JWT
   * @param noteId A noteId of a note. A note with this id should exist in the database
   */
  async fetchNoteForEdit(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneBy({ id: noteId });

    if (!note || note.owner.id !== userId) {
      throw new InternalServerErrorException(
        `Entity NoteModel, id=${noteId} not found in the database`,
      );
    }

    return note;
  }

  /**
   * A method that validates color
   */
  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_COLOR);
    }
  }

  /**
   * A method that compares user identifiers from JWT and request body
   * @param owner_id An owner_id from request body
   * @param user_id An user_id from JWT
   */
  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    }
  }

  /**
   * A method that adds the owner_id property to Note according to the requirements
   */
  getRequiredFormatNote(note: NoteApiDto): NoteApiDto {
    note.owner_id = note.owner.id;

    return note;
  }

  /**
   * A method that calculates notes statistics by user
   * @returns A percentage of completed notes to total notes by owner
   */
  async fetchQuickNotesStatisticsByOwner(ownerId: string): Promise<string> {
    const ownerNotesQueryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .andWhere('notes.owner_id = :id', { id: ownerId })
      .select('COUNT(notes)');

    const createdNotesObject = await ownerNotesQueryBuilder.getRawOne();
    const completedNotesObject = await ownerNotesQueryBuilder
      .andWhere('notes.is_completed = :isCompleted', { isCompleted: true })
      .getRawOne();

    const created_notes = +createdNotesObject.count;
    const completed_notes = +completedNotesObject.count;
    const quick_notes = created_notes
      ? `${((completed_notes / created_notes) * 100).toFixed(0)}%`
      : '0%';

    return quick_notes;
  }
}
