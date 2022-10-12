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
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { Data, EntityId } from '../common/classes';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { MessageEnum, NoteMessageEnum } from '../common/enums/messages.enum';
import { UserEntity } from '../user/entities/user.entity';
import { getApiParam } from '../utils';
import { CreateNoteDto, NoteApiDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';

@ApiTags('Notes:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('notes')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Note' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(NoteApiDto)
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}"`,
  })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<NoteApiDto>> {
    const data = await this.noteService.createNote(createNoteDto, currentUser);
    return { data };
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Delete Note' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(EntityId)
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
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
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(NoteApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${NoteMessageEnum.INVALID_NOTE_ID}"` })
  @ApiParam(getApiParam('id', 'note'))
  async getNote(
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiDto>> {
    const data = await this.noteService.getNote(userId, noteId);
    return { data };
  }

  @Get('user-notes/:ownerId')
  @ApiOperation({ summary: "Fetch User's Notes" })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(NoteApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchUserNotes(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<NoteApiDto[]>> {
    const data = await this.noteService.fetchUserNotes(userId, ownerId);
    return { data };
  }

  @Put('notes/:id')
  @ApiOperation({ summary: 'Update Note' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(NoteApiDto)
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}"`,
  })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'note'))
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @User('id') userId: string,
    @Param('id') noteId: string,
  ): Promise<Data<NoteApiDto>> {
    const data = await this.noteService.updateNote(updateNoteDto, userId, noteId);
    return { data };
  }
}
