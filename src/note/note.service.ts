import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, NoteResponseDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';
import { ExtendedNoteType } from './types/extended-note.type';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async fetchUserNotes(userId: string, ownerId: string): Promise<NoteResponseDto[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .andWhere('notes.owner_id = :id', { id: userId })
      .orderBy('notes.created_at', 'ASC');

    const notes = await queryBuilder.getMany();

    return notes.map((note: ExtendedNoteType) => this.getNoteWithOwnerId(note));
  }

  async fetchOneNote(userId: string, noteId: string): Promise<NoteResponseDto> {
    const note = await this.findNoteForRead(userId, noteId);

    return this.getNoteWithOwnerId(note as ExtendedNoteType);
  }

  async createNote(
    createNoteDto: CreateNoteDto,
    currentUser: UserEntity,
  ): Promise<NoteResponseDto> {
    this.validateHexColor(createNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = createNoteDto;
    this.idsMatching(owner_id, currentUser.id);

    const newNote = new NoteEntity();
    Object.assign(newNote, dtoWithoutOwner);
    newNote.owner = currentUser;
    const savedNote = await this.noteRepository.save(newNote);

    return this.getNoteWithOwnerId(savedNote as ExtendedNoteType);
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: string,
    noteId: string,
  ): Promise<NoteResponseDto> {
    this.validateHexColor(updateNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = updateNoteDto;
    this.idsMatching(owner_id, userId);

    const currentNote = await this.findNoteForEdit(userId, noteId);
    Object.assign(currentNote, dtoWithoutOwner);
    const savedNote = await this.noteRepository.save(currentNote);

    return this.getNoteWithOwnerId(savedNote as ExtendedNoteType);
  }

  async deleteNote(userId: string, noteId: string): Promise<{ id: string }> {
    await this.findNoteForEdit(userId, noteId);
    await this.noteRepository.delete({ id: noteId });

    return { id: noteId };
  }

  async findNoteForRead(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneBy({ id: noteId });

    if (!note || note.owner.id !== userId) {
      throw new UnprocessableEntityException('The note id is not valid');
    }

    return note;
  }

  async findNoteForEdit(userId: string, noteId: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneBy({ id: noteId });

    if (!note || note.owner.id !== userId) {
      throw new InternalServerErrorException(
        `Entity NoteModel, id=${noteId} not found in the database`,
      );
    }

    return note;
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
      throw new UnprocessableEntityException('The user id is not valid');
    }
  }

  getNoteWithOwnerId(note: ExtendedNoteType): NoteResponseDto {
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
