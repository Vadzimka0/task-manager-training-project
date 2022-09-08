import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteApiType } from './types/note-api.type';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async fetchAllOwnersNotes(userId: string): Promise<NoteApiType[]> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .andWhere('notes.owner_id = :id', { id: userId })
      .orderBy('notes.created_at', 'ASC');

    const notes = await queryBuilder.getMany();
    const notesWithOwnerId = notes.map((note: NoteApiType) => this.getNoteWithOwnerId(note));
    return notesWithOwnerId;
  }

  async fetchOneNote(userId: string, noteId: string): Promise<NoteApiType> {
    const note = await this.findAndValidateNote(userId, noteId);
    return this.getNoteWithOwnerId(note as NoteApiType);
  }

  async createNote(createNoteDto: CreateNoteDto, currentUser: UserEntity): Promise<NoteApiType> {
    this.validateHexColor(createNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = createNoteDto;
    this.idsMatching(owner_id, currentUser.id);

    const newNote = new NoteEntity();
    Object.assign(newNote, dtoWithoutOwner);
    newNote.owner = currentUser;

    const savedNote = await this.noteRepository.save(newNote);
    return this.getNoteWithOwnerId(savedNote as NoteApiType);
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: string,
    noteId: string,
  ): Promise<NoteApiType> {
    this.validateHexColor(updateNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = updateNoteDto;
    this.idsMatching(owner_id, userId);

    const currentNote = await this.findAndValidateNote(userId, noteId);
    Object.assign(currentNote, dtoWithoutOwner);

    const savedNote = await this.noteRepository.save(currentNote);
    return this.getNoteWithOwnerId(savedNote as NoteApiType);
  }

  async deleteNote(userId: string, noteId: string): Promise<{ id: string }> {
    await this.findAndValidateNote(userId, noteId);
    await this.noteRepository.delete({ id: noteId });
    return { id: noteId };
  }

  async findAndValidateNote(userId: string, noteId: string): Promise<NoteEntity> {
    try {
      const note = await this.noteRepository.findOneBy({ id: noteId });
      if (!note) {
        throw new InternalServerErrorException(
          `Entity NoteModel, id=${noteId} not found in the database`,
        );
      }
      if (note.owner.id !== userId) {
        throw new UnprocessableEntityException('The note id is not valid. You are not the owner');
      }
      return note;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(
        'Color is not valid. The length has to be 7 symbols and first one has to be #.',
      );
    }
  }

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new ForbiddenException('Invalid owner_id');
    }
  }

  getNoteWithOwnerId(note: NoteApiType): NoteApiType {
    note.owner_id = note.owner.id;
    return note;
  }

  async getQuickNotesStatisticsByOwner(ownerId: string): Promise<string> {
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
