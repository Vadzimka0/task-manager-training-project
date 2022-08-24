import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteType } from './types';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async fetchOneNote(userId: string, noteId: string): Promise<NoteEntity> {
    try {
      const note = await this.noteRepository.findOneBy({ id: noteId });
      if (note.owner.id !== userId) {
        // 'You are not an owner'
        throw new UnprocessableEntityException(`The note id is not valid.`);
      }
      return await this.noteRepository.save(note);
    } catch (_) {
      throw new UnprocessableEntityException(`The note id is not valid.`);
    }
  }

  async fetchAllOwnersNotes(userId: string): Promise<NoteEntity[]> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .andWhere('notes.owner_id = :id', { id: userId })
      .orderBy('notes.created_at', 'ASC');

    const notes = await queryBuilder.getMany();
    const notesWithOwnerId = notes.map((note: NoteType) => this.buildNoteWithOwnerId(note));
    return notesWithOwnerId;
  }

  async createNote(createNoteDto: CreateNoteDto, currentUser: UserEntity): Promise<NoteEntity> {
    this.validateHexColor(createNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = createNoteDto;
    this.idsMatching(owner_id, currentUser.id);

    const newNote = new NoteEntity();
    Object.assign(newNote, dtoWithoutOwner);
    newNote.owner = currentUser;
    return await this.noteRepository.save(newNote);
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: string,
    noteId: string,
  ): Promise<NoteEntity> {
    this.validateHexColor(updateNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = updateNoteDto;
    this.idsMatching(owner_id, userId);

    const currentNote = await this.findAndValidateNote(userId, noteId);
    Object.assign(currentNote, dtoWithoutOwner);
    return await this.noteRepository.save(currentNote);
  }

  async deleteNote(userId: string, noteId: string): Promise<{ id: string }> {
    await this.findAndValidateNote(userId, noteId);
    await this.noteRepository.delete({ id: noteId });
    return { id: noteId };
  }

  async findAndValidateNote(userId: string, noteId: string): Promise<NoteEntity> {
    try {
      const note = await this.noteRepository.findOneBy({ id: noteId });
      if (note.owner.id !== userId) {
        // 'You are not an owner'
        throw new InternalServerErrorException(
          `Entity NoteModel, id=${noteId} not found in the database`,
        );
      }
      return note;
    } catch (_) {
      throw new InternalServerErrorException(
        `Entity NoteModel, id=${noteId} not found in the database`,
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
      throw new ForbiddenException('Invalid ID. You are not an owner');
    }
  }

  buildNoteWithOwnerId(note: NoteType): NoteType {
    note.owner_id = note.owner.id;
    return note;
  }
}
