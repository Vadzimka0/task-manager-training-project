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
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { Data, ResponseD } from '../common/types/data';
import { EntityId } from '../common/types/entity-id-class';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNoteDto, NoteResponseDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';

@ApiTags('Notes:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: 'Create New Note' })
  @ApiOkObjectResponse(NoteResponseDto)
  @ApiBearerAuth('access-token')
  @Post('notes')
  @HttpCode(200)
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<ResponseD<NoteResponseDto>> {
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
  ): Promise<Data<EntityId>> {
    const data = await this.noteService.deleteNote(userId, noteId);
    return { data };
  }

  @ApiOperation({ summary: "Fetch One User's Note" })
  @ApiOkObjectResponse(NoteResponseDto)
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
  ): Promise<ResponseD<NoteResponseDto>> {
    const data = await this.noteService.fetchOneNote(userId, noteId);
    return { data };
  }

  @ApiOperation({ summary: "Fetch User's Notes" })
  @ApiOkArrayResponse(NoteResponseDto)
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
  ): Promise<ResponseD<NoteResponseDto[]>> {
    const data = await this.noteService.fetchUserNotes(userId, ownerId);
    return { data };
  }

  @ApiOperation({ summary: 'Update Note' })
  @ApiOkObjectResponse(NoteResponseDto)
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
  ): Promise<ResponseD<NoteResponseDto>> {
    const data = await this.noteService.updateNote(updateNoteDto, userId, noteId);
    return { data };
  }
}
