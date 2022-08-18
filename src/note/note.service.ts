import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteResponseInterface, NotesResponseInterface } from './types';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}

  async findAllAuthorsNotes(userId: number): Promise<NotesResponseInterface> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.author', 'author')
      .andWhere('notes.authorId = :id', { id: userId })
      .orderBy('notes.createdAt', 'DESC');
    const notesCount = await queryBuilder.getCount();
    const notes = await queryBuilder.getMany();
    const notesWithoutAuthor = notes.map((note) => {
      delete note.author;
      return note;
    });
    return { notes: notesWithoutAuthor, notesCount };
  }

  async createNote(createNoteDto: CreateNoteDto, currentUser: UserEntity): Promise<NoteEntity> {
    const newNote = new NoteEntity();
    Object.assign(newNote, createNoteDto);
    newNote.author = currentUser;
    return await this.noteRepository.save(newNote);
  }

  async updateNote(
    updateNoteDto: UpdateNoteDto,
    userId: number,
    noteId: number,
  ): Promise<NoteEntity> {
    const currentNote = await this.findAndValidateNote(userId, noteId);
    Object.assign(currentNote, updateNoteDto);
    return await this.noteRepository.save(currentNote);
  }

  async deleteNote(userId: number, noteId: number): Promise<DeleteResult> {
    await this.findAndValidateNote(userId, noteId);
    return await this.noteRepository.delete({ id: noteId });
  }

  async findAndValidateNote(userId: number, noteId: number): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneBy({ id: noteId });
    if (!note) {
      throw new HttpException('Note does not exist', HttpStatus.NOT_FOUND);
    }
    if (note.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return note;
  }

  buildNoteResponse(note: NoteEntity): NoteResponseInterface {
    delete note.author;
    return { note };
  }
}
