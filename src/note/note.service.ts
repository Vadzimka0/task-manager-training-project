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
import { NoteType } from './types';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async fetchAllOwnersNotes(userId: string): Promise<NoteType[]> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .andWhere('notes.owner_id = :id', { id: userId })
      .orderBy('notes.created_at', 'ASC');

    const notes = await queryBuilder.getMany();
    const notesWithOwnerId = notes.map((note: NoteType) => this.getNoteWithOwnerId(note));
    return notesWithOwnerId;
  }

  async fetchOneNote(userId: string, noteId: string): Promise<NoteType> {
    const note = await this.findAndValidateNote(userId, noteId);
    return this.getNoteWithOwnerId(note as NoteType);
  }

  async createNote(createNoteDto: CreateNoteDto, currentUser: UserEntity): Promise<NoteType> {
    this.validateHexColor(createNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = createNoteDto;
    this.idsMatching(owner_id, currentUser.id);

    const newNote = new NoteEntity();
    Object.assign(newNote, dtoWithoutOwner);
    newNote.owner = currentUser;

    const savedNote = await this.noteRepository.save(newNote);
    return this.getNoteWithOwnerId(savedNote as NoteType);
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: string,
    noteId: string,
  ): Promise<NoteType> {
    this.validateHexColor(updateNoteDto.color);
    const { owner_id, ...dtoWithoutOwner } = updateNoteDto;
    this.idsMatching(owner_id, userId);

    const currentNote = await this.findAndValidateNote(userId, noteId);
    Object.assign(currentNote, dtoWithoutOwner);

    const savedNote = await this.noteRepository.save(currentNote);
    return this.getNoteWithOwnerId(savedNote as NoteType);
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
        throw new UnprocessableEntityException('The note id is not valid. You are not the owner'); //Invalid ID. You are not an owner
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

  getNoteWithOwnerId(note: NoteType): NoteType {
    note.owner_id = note.owner.id;
    return note;
  }
}
