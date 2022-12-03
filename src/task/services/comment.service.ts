import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageEnum } from '../../shared/enums/messages.enum';
import { UtilsService } from '../../shared/services/utils.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserAvatarService } from '../../user/services/user-avatar.service';
import { UserApiType } from '../../user/types/user-api.type';
import { CommentApiDto } from '../dto/api-dto/comment-api.dto';
import { CommentAttachmentApiDto } from '../dto/api-dto/comment-attachment-api.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentAttachmentService } from './comment-attachment.service';
import { TaskService } from './task.service';

@Injectable()
export class CommentService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly taskService: TaskService,
    private readonly utilsService: UtilsService,
    private readonly userAvatarService: UserAvatarService,
    @Inject(forwardRef(() => CommentAttachmentService))
    private readonly commentAttachmentService: CommentAttachmentService,
  ) {}

  /**
   * A method that creates a comment in the database
   * @param currentUser An user from JWT
   */
  async createComment(
    commentDto: CreateCommentDto,
    currentUser: UserEntity,
  ): Promise<CommentEntity> {
    const { owner_id, task_id, ...dtoWithoutRelationItems } = commentDto;
    this.taskService.idsMatching(owner_id, currentUser.id);

    const newComment = new CommentEntity();
    Object.assign(newComment, dtoWithoutRelationItems);

    newComment.commentator = currentUser;

    const currentTask = await this.taskService.getValidTaskForComment(currentUser.id, task_id);
    newComment.task = currentTask;

    return await this.commentRepository.save(newComment);
  }

  /**
   * A method that fetches task comments from the database
   * @param taskId A taskId of a task. A task with this id should exist in the database
   */
  async fetchTaskComments(taskId: string): Promise<CommentEntity[]> {
    await this.taskService.fetchTask(taskId);

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.task', 'task')
      .leftJoinAndSelect('comments.commentator', 'commentator')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .leftJoinAndSelect('attachments.comment', 'comment')
      .andWhere('task.id = :id', { id: taskId })
      .orderBy('comments.created_at', 'ASC');

    return await queryBuilder.getMany();
  }

  /**
   * A method that deletes a comment from the database. Files related to this comment are also deleted from the storage.
   * @param userId An userId from JWT
   * @param commentId A commentId of a comment. A comment with this id should exist in the database
   * @returns A promise with the id of deleted comment
   */
  async deleteComment(userId: string, commentId: string): Promise<{ id: string }> {
    await this.fetchComment(userId, commentId);
    const commentAttachmentsPaths = await this.getCommentAttachmentsPaths(commentId);

    await this.commentRepository.delete({ id: commentId });
    await this.utilsService.removeFilesFromStorage(commentAttachmentsPaths);

    return { id: commentId };
  }

  /**
   * A method that fetches comment attachments from the database
   * @param commentId A commentId of a comment. A comment with this id should exist in the database
   * @returns A promise with the list of attachments paths
   */
  async getCommentAttachmentsPaths(commentId: string): Promise<string[]> {
    const commentAttachmentsPaths = await this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('comments.id = :id', { id: commentId })
      .select('attachments.path')
      .getRawMany();

    return commentAttachmentsPaths.map((path) => path.attachments_path);
  }

  /**
   * A method that fetches a comment from the database
   * @param userId An userId from JWT
   * @param commentId A commentId of a comment. A comment with this id should exist in the database
   */
  async fetchComment(userId: string, commentId: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOneBy({ id: commentId });

    if (!comment) {
      throw new InternalServerErrorException(
        `Entity CommentModel, id=${commentId} not found in the database`,
      );
    }

    if (comment.commentator.id !== userId) {
      throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
    }

    return comment;
  }

  /**
   * A method that adds properties: owner_id, task_id, attachments to Comment according to the requirements
   */
  getRequiredFormatComment(comment: CommentApiDto): CommentApiDto {
    comment.owner_id = comment.commentator.id;
    comment.task_id = comment.task.id;
    comment.attachments = comment.attachments?.length
      ? comment.attachments.map((attachment: CommentAttachmentApiDto) =>
          this.commentAttachmentService.getRequiredFormatCommentAttachment(attachment),
        )
      : null;
    comment.commentator = this.userAvatarService.getRequiredFormatUser(
      comment.commentator as UserApiType,
    );

    return comment;
  }
}
