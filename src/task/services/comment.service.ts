import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageEnum } from '../../common/enums/message.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { removeFilesFromStorage } from '../../utils';
import { CommentApiDto } from '../dto/api-dto/comment-api.dto';
import { CommentAttachmentApiDto } from '../dto/api-dto/comment-attachment-api.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentAttachmentService } from './comment-attachment.service';
import { TaskService } from './task.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => CommentAttachmentService))
    private readonly commentAttachmentService: CommentAttachmentService,
  ) {}

  async createComment(
    commentDto: CreateCommentDto,
    currentUser: UserEntity,
  ): Promise<CommentApiDto> {
    const { owner_id, task_id, ...dtoWithoutRelationItems } = commentDto;
    this.taskService.idsMatching(owner_id, currentUser.id);

    const newComment = new CommentEntity();
    Object.assign(newComment, dtoWithoutRelationItems);

    newComment.owner = currentUser;

    const currentTask = await this.taskService.getValidTaskForComment(currentUser.id, task_id);
    newComment.task = currentTask;

    const savedComment = await this.commentRepository.save(newComment);

    return this.getCommentWithRelationIds(savedComment as CommentApiDto);
  }

  async fetchTaskComments(taskId: string): Promise<CommentApiDto[]> {
    await this.taskService.getAnyTaskById(taskId);

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.task', 'task')
      .leftJoinAndSelect('comments.owner', 'owner')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .leftJoinAndSelect('attachments.comment', 'comment')
      .andWhere('task.id = :id', { id: taskId })
      .orderBy('comments.created_at', 'ASC');

    const comments = await queryBuilder.getMany();

    return comments.map((comment: CommentApiDto) => this.getCommentWithRelationIds(comment));
  }

  async deleteComment(userId: string, commentId: string): Promise<{ id: string }> {
    await this.getValidComment(userId, commentId);
    const commentAttachmentsPaths = await this.getCommentAttachmentsPaths(commentId);

    await this.commentRepository.delete({ id: commentId });
    await removeFilesFromStorage(commentAttachmentsPaths);

    return { id: commentId };
  }

  async getCommentAttachmentsPaths(commentId: string): Promise<string[]> {
    const commentAttachmentsPaths = await this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('comments.id = :id', { id: commentId })
      .select('attachments.path')
      .getRawMany();

    return commentAttachmentsPaths.map((path) => path.attachments_path);
  }

  async getValidComment(userId: string, commentId: string): Promise<CommentEntity> {
    try {
      const comment = await this.commentRepository.findOneBy({ id: commentId });

      if (!comment) {
        throw new InternalServerErrorException(
          `Entity CommentModel, id=${commentId} not found in the database`,
        );
      }

      if (comment.owner.id !== userId) {
        throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
      }

      return comment;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getCommentWithRelationIds(comment: CommentApiDto): CommentApiDto {
    comment.owner_id = comment.owner.id;
    comment.task_id = comment.task.id;
    comment.attachments = comment.attachments?.length
      ? comment.attachments.map((attachment: CommentAttachmentApiDto) =>
          this.commentAttachmentService.getFullCommentAttachment(attachment),
        )
      : null;

    return comment;
  }
}
