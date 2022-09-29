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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { EntityId, Data } from '../common/classes';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { UserEntity } from '../user/entities/user.entity';
import { getApiParam } from '../utils';
import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';
import { NoteApiType } from './types/note-api.type';

@ApiTags('Notes:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('notes')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Note' })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.createNote(createNoteDto, currentUser);
    return { data };
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Delete Note' })
  @ApiOkObjectResponse(EntityId)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('id', 'note'))
  async deleteNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<EntityId>> {
    const data = await this.noteService.deleteNote(userId, noteId);
    return { data };
  }

  @Get('notes/:id')
  @ApiOperation({ summary: "Fetch One User's Note" })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('id', 'note'))
  async fetchOneNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.fetchOneNote(userId, noteId);
    return { data };
  }

  @Get('user-notes/:ownerId')
  @ApiOperation({ summary: "Fetch User's Notes" })
  @ApiOkArrayResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchUserNotes(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<NoteApiType[]>> {
    const data = await this.noteService.fetchUserNotes(userId, ownerId);
    return { data };
  }

  @Put('notes/:id')
  @ApiOperation({ summary: 'Update Note' })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('id', 'note'))
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiType>> {
    const data = await this.noteService.updateNote(updateNoteDto, userId, noteId);
    return { data };
  }
}
