import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { EntityId } from '../../common/classes';
import { Data } from '../../common/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../../common/decorators';
import { CommentMessageEnum, MessageEnum } from '../../common/enums/messages.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { getApiParam } from '../../utils';
import { CreateCommentDto } from '../dto';
import { CommentApiDto } from '../dto/api-dto/comment-api.dto';
import { CommentService } from '../services';

@ApiTags('Tasks Comments:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Comment' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(CommentApiDto)
  @ApiForbiddenResponse({ description: `"${CommentMessageEnum.INVALID_ID_NOT_OWNER_OR_MEMBER}"` })
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  async createComment(
    @Body() commentDto: CreateCommentDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<CommentApiDto>> {
    const comment = await this.commentService.createComment(commentDto, currentUser);
    const data = this.commentService.getRequiredFormatComment(comment as CommentApiDto);
    return { data };
  }

  @Get('tasks-comments/:taskId')
  @ApiOperation({ summary: 'Fetch Task Comments' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(CommentApiDto)
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('taskId', 'task'))
  async fetchTaskComments(@Param('taskId') taskId: string): Promise<Data<CommentApiDto[]>> {
    const comments = await this.commentService.fetchTaskComments(taskId);
    const data = comments.map((comment: CommentApiDto) =>
      this.commentService.getRequiredFormatComment(comment),
    );
    return { data };
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete Comment' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(EntityId)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('commentId', 'comment'))
  async deleteComment(
    @User('id') userId: string,
    @Param('commentId') commentId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.commentService.deleteComment(userId, commentId);
    return { data };
  }
}
