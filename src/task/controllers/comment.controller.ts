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

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/classes/response-data';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateCommentDto } from '../dto';
import { CommentService } from '../services';
import { CommentApiType } from '../types';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  @HttpCode(200)
  async createComment(
    @Body() commentDto: CreateCommentDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<CommentApiType>> {
    const data = await this.commentService.createComment(commentDto, currentUser);
    return { data };
  }

  @Get('tasks-comments/:taskId')
  async fetchTaskComments(@Param('taskId') taskId: string): Promise<Data<CommentApiType[]>> {
    const data = await this.commentService.fetchTaskComments(taskId);
    return { data };
  }

  @Delete('comments/:commentId')
  async deleteComment(
    @User('id') userId: string,
    @Param('commentId') commentId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.commentService.deleteComment(userId, commentId);
    return { data };
  }
}
