import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { Data } from '../common/types/data';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteEntity } from './entities/note.entity';
import { NoteService } from './note.service';
import { NoteType } from './types/note.type';

@Controller('notes')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get(':id')
  async fetchOneNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteEntity>> {
    const note = await this.noteService.fetchOneNote(userId, noteId);
    const data = this.noteService.buildNoteWithOwnerId(note as NoteType);
    return { data };
  }

  @Get()
  async fetchAllOwnersNotes(@User('id') userId: string): Promise<Data<NoteEntity[]>> {
    const data = await this.noteService.fetchAllOwnersNotes(userId);
    return { data };
  }

  @Post()
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<NoteEntity>> {
    const note = await this.noteService.createNote(createNoteDto, currentUser);
    const data = this.noteService.buildNoteWithOwnerId(note as NoteType);
    return { data };
  }

  @Put(':id')
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteEntity>> {
    const note = await this.noteService.updateNote(updateNoteDto, userId, noteId);
    const data = this.noteService.buildNoteWithOwnerId(note as NoteType);
    return { data };
  }

  @Delete(':id')
  async deleteNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.noteService.deleteNote(userId, noteId);
    return { data };
  }
}
