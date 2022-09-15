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
import { taskAttachmentOptions } from '../../utils/multer/task-attachment-options';
import { AddTaskAttachmentDto } from '../dto';
import { TaskAttachmentService } from '../services';
import { TaskAttachmentApiType } from '../types';

import type { Response } from 'express';

@Controller('tasks-attachments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskAttachmentController {
  constructor(private readonly taskAttachmentService: TaskAttachmentService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', taskAttachmentOptions))
  async addTaskAttachment(
    @User('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() addTaskAttachmentDto: AddTaskAttachmentDto,
  ): Promise<Data<TaskAttachmentApiType>> {
    const data = await this.taskAttachmentService.addTaskAttachment(
      userId,
      addTaskAttachmentDto,
      file,
    );
    return { data };
  }

  @Get(':id')
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
