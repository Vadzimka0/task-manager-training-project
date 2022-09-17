import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { isExists } from '../../utils';
import { commentAttachmentOptions } from '../../utils/multer/comment-attachment-options';
import { AddCommentAttachmentDto } from '../dto';
import { CommentAttachmentService } from '../services';
import { CommentAttachmentApiType } from '../types';

import type { Response } from 'express';

@Controller('comments-attachments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentAttachmentController {
  constructor(private readonly commentAttachmentService: CommentAttachmentService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', commentAttachmentOptions))
  async addCommentAttachment(
    @User('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() addCommentAttachmentDto: AddCommentAttachmentDto,
  ): Promise<Data<CommentAttachmentApiType>> {
    const data = await this.commentAttachmentService.addCommentAttachment(
      userId,
      addCommentAttachmentDto,
      file,
    );
    return { data };
  }

  @Get(':id')
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.commentAttachmentService.getFileById(id);

    const isFileExists = await isExists(file.path);
    if (!isFileExists) {
      throw new NotFoundException(`sorry, file ${file.filename} not found`);
    }

    const stream = createReadStream(join(process.cwd(), file.path));

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return new StreamableFile(stream);
  }
}
