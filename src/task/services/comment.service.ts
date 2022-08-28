import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentApiType } from '../types/comment-api.type';
import { TaskService } from './task.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly taskService: TaskService,
  ) {}

  async createComment(
    commentDto: CreateCommentDto,
    currentUser: UserEntity,
  ): Promise<CommentApiType> {
    const { owner_id, task_id, ...dtoWithoutRelationItems } = commentDto;
    this.taskService.idsMatching(owner_id, currentUser.id);

    const newComment = new CommentEntity();
    Object.assign(newComment, dtoWithoutRelationItems);

    newComment.owner = currentUser;

    const currentTask = await this.taskService.getValidTaskForComment(currentUser.id, task_id);
    newComment.task = currentTask;

    // attachments

    const savedComment = await this.commentRepository.save(newComment);
    return this.getCommentWithRelationIds(savedComment as CommentApiType);
  }

  async fetchTaskComments(userId: string, taskId: string): Promise<CommentApiType[]> {
    // TODO: matching projectid and owner
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.task', 'task')
      .leftJoinAndSelect('comments.owner', 'owner')
      // .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('task.id = :id', { id: taskId })
      .orderBy('comments.created_at', 'ASC');

    const comments = await queryBuilder.getMany();
    const commentsWithRelationIds = comments.map((comment: CommentApiType) =>
      this.getCommentWithRelationIds(comment),
    );
    return commentsWithRelationIds;
  }

  async deleteComment(userId: string, commentId: string): Promise<{ id: string }> {
    await this.getValidComment(userId, commentId);
    await this.commentRepository.delete({ id: commentId });
    return { id: commentId };
  }

  async getValidComment(userId: string, commentId: string): Promise<CommentEntity> {
    try {
      const comment = await this.commentRepository.findOneBy({ id: commentId });
      if (!comment) {
        throw new NotFoundException(
          `Entity CommentModel, id=${commentId} not found in the database`,
        );
      }
      if (comment.owner.id !== userId) {
        throw new ForbiddenException('Invalid ID. You are not an owner');
      }
      return comment;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getCommentWithRelationIds(comment: CommentApiType): CommentApiType {
    comment.owner_id = comment.owner.id;
    comment.task_id = comment.task.id;
    // attachments
    return comment;
  }
}
