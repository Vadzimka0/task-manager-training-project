import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import path, { join } from 'path';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { isExists } from '../../utils';
import { taskAttachmentOptions } from '../../utils/multer/task-attachment-options';
import { AddTaskAttachmentDto } from '../dto';
import { TaskAttachmentService } from '../services';
import { TaskAttachmentApiType } from '../types';

import type { Response } from 'express';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskAttachmentController {
  private server_url: string;

  constructor(
    private readonly taskAttachmentService: TaskAttachmentService,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}:${this.configService.get(
      'URL_PORT',
    )}/${this.configService.get('URL_PREFIX_PATH')}/`;
  }

  @Post('tasks-attachments')
  @UseInterceptors(FileInterceptor('file', taskAttachmentOptions))
  async addTaskAttachment(
    @User('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() addTaskAttachmentDto: AddTaskAttachmentDto,
  ): Promise<Data<TaskAttachmentApiType>> {
    const data = await this.taskAttachmentService.addTaskAttachment(
      userId,
      addTaskAttachmentDto.task_id,
      {
        id: file.filename,
        url: `${this.server_url}${file.path.substring(file.path.indexOf('/') + 1)}`,
        mimetype: file.mimetype,
        type: addTaskAttachmentDto.type,
        path: file.path,
        filename: file.originalname,
      },
    );
    return { data };
  }

  @Get('tasks-attachments/:id')
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.taskAttachmentService.getFileById(id);

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
