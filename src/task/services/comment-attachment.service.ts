import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentAttachmentEntity } from '../entities';
import { CommentAttachmentApiType, CommentAttachmentData } from '../types';
import { CommentService } from './comment.service';

@Injectable()
export class CommentAttachmentService {
  constructor(
    @InjectRepository(CommentAttachmentEntity)
    private readonly commentAttachmentRepository: Repository<CommentAttachmentEntity>,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  async addCommentAttachment(
    userId: string,
    comment_id: string,
    filedata: CommentAttachmentData,
  ): Promise<CommentAttachmentApiType> {
    const currentComment = await this.commentService.getValidComment(userId, comment_id);

    const newCommentAttachment = new CommentAttachmentEntity();
    Object.assign(newCommentAttachment, filedata);
    newCommentAttachment.comment = currentComment;

    const savedAttachment = await this.commentAttachmentRepository.save(newCommentAttachment);
    return this.getAttachmentWithTaskId(savedAttachment as CommentAttachmentApiType);
  }

  async getFileById(id: string) {
    const file = await this.commentAttachmentRepository.findOneBy({ id });
    if (!file) {
      throw new NotFoundException(
        `Entity CommentAttachmentModel, id=${id} not found in the database`,
      );
    }
    return file;
  }

  getAttachmentWithTaskId(attachment: CommentAttachmentApiType): CommentAttachmentApiType {
    attachment.comment_id = attachment.comment.id;
    return attachment;
  }
}
