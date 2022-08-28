import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { NoteService } from './note.service';
import { NoteApiType } from './types/note-api.type';

@Controller('notes')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async fetchAllOwnersNotes(@User('id') userId: string): Promise<Data<NoteApiType[]>> {
    const data = await this.noteService.fetchAllOwnersNotes(userId);
    return { data };
  }

  @Get(':id')
  async fetchOneNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.fetchOneNote(userId, noteId);
    return { data };
  }

  @Post()
  @HttpCode(200)
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.createNote(createNoteDto, currentUser);
    return { data };
  }

  @Put(':id')
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.updateNote(updateNoteDto, userId, noteId);
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
