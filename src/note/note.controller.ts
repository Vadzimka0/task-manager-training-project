import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';
import { NoteResponseInterface, NotesResponseInterface } from './types';

@Controller('notes')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async findAllAuthorsNotes(@User('id') userId: number): Promise<NotesResponseInterface> {
    return this.noteService.findAllAuthorsNotes(userId);
  }

  @Post()
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<NoteResponseInterface> {
    const note = await this.noteService.createNote(createNoteDto, currentUser);
    return this.noteService.buildNoteResponse(note);
  }

  @Patch(':id')
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') currentUserId: number,
    @Param('id') noteId: number,
  ): Promise<NoteResponseInterface> {
    const note = await this.noteService.updateNote(updateNoteDto, currentUserId, noteId);
    return this.noteService.buildNoteResponse(note);
  }

  @Delete(':id')
  async deleteNote(
    @User('id') currentUserId: number,
    @Param('id') noteId: number,
  ): Promise<DeleteResult> {
    return await this.noteService.deleteNote(currentUserId, noteId);
  }
}
