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
import { EntityId, ResponseData } from '../common/classes';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';
import { NoteApiType } from './types/note-api.type';

@ApiTags('Notes:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'Create New Note' })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @Post('notes')
  @HttpCode(200)
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<ResponseData<NoteApiType>> {
    const data = await this.noteService.createNote(createNoteDto, currentUser);
    return { data };
  }

  @ApiOperation({ summary: 'Delete Note' })
  @ApiOkObjectResponse(EntityId)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a NOTE that exists in the database',
    type: String,
  })
  @Delete('notes/:id')
  async deleteNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<ResponseData<EntityId>> {
    const data = await this.noteService.deleteNote(userId, noteId);
    return { data };
  }

  @ApiOperation({ summary: "Fetch One User's Note" })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a NOTE that exists in the database',
    type: String,
  })
  @Get('notes/:id')
  async fetchOneNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<ResponseData<NoteApiType>> {
    const data = await this.noteService.fetchOneNote(userId, noteId);
    return { data };
  }

  @ApiOperation({ summary: "Fetch User's Notes" })
  @ApiOkArrayResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'ownerId',
    required: true,
    description: 'Should be an id of a USER that exists in the database',
    type: String,
  })
  @Get('user-notes/:ownerId')
  async fetchUserNotes(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<ResponseData<NoteApiType[]>> {
    const data = await this.noteService.fetchUserNotes(userId, ownerId);
    return { data };
  }

  @ApiOperation({ summary: 'Update Note' })
  @ApiOkObjectResponse(NoteApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a NOTE that exists in the database',
    type: String,
  })
  @Put('notes/:id')
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<ResponseData<NoteApiType>> {
    const data = await this.noteService.updateNote(updateNoteDto, userId, noteId);
    return { data };
  }
}
