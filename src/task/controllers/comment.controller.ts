import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';
import { CommentApiType } from '../types/comment-api.type';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  async createComment(
    @Body() commentDto: CreateCommentDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<CommentApiType>> {
    const data = await this.commentService.createComment(commentDto, currentUser);
    return { data };
  }

  @Get('tasks-comments/:taskId')
  async fetchTaskComments(
    @User('id') userId: string,
    @Param('taskId') taskId: string,
  ): Promise<Data<CommentApiType[]>> {
    const data = await this.commentService.fetchTaskComments(userId, taskId);
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
