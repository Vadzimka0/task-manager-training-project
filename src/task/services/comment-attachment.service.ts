import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddCommentAttachmentDto } from '../dto';
import { CommentAttachmentApiDto } from '../dto/api-dto/comment-attachment-api.dto';
import { CommentAttachmentEntity } from '../entities/comment-attachment.entity';
import { CommentService } from './comment.service';

@Injectable()
export class CommentAttachmentService {
  private server_url: string;

  constructor(
    @InjectRepository(CommentAttachmentEntity)
    private readonly commentAttachmentRepository: Repository<CommentAttachmentEntity>,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}/${this.configService.get(
      'URL_PREFIX_PATH',
    )}/`;
  }

  async addCommentAttachment(
    userId: string,
    addCommentAttachmentDto: AddCommentAttachmentDto,
    file: Express.Multer.File,
  ): Promise<CommentAttachmentApiDto> {
    const currentComment = await this.commentService.getValidComment(
      userId,
      addCommentAttachmentDto.comment_id,
    );

    const filedata = {
      id: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      filename: file.originalname,
      type: addCommentAttachmentDto.type,
    };

    const newCommentAttachment = new CommentAttachmentEntity();
    Object.assign(newCommentAttachment, filedata);
    newCommentAttachment.comment = currentComment;

    const savedAttachment = await this.commentAttachmentRepository.save(newCommentAttachment);
    return this.getFullCommentAttachment(savedAttachment as CommentAttachmentApiDto);
  }

  async getFileById(id: string): Promise<CommentAttachmentEntity> {
    const file = await this.commentAttachmentRepository.findOneBy({ id });
    if (!file) {
      throw new InternalServerErrorException(
        `Entity CommentAttachmentModel, id=${id} not found in the database`,
      );
    }
    return file;
  }

  getFullCommentAttachment(attachment: CommentAttachmentApiDto): CommentAttachmentApiDto {
    attachment.comment_id = attachment.comment.id;
    attachment.url = `${this.server_url}${attachment.path.substring(
      attachment.path.indexOf('/') + 1,
    )}`;
    return attachment;
  }
}
