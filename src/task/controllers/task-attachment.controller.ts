import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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
import { diskStorage } from 'multer';
import { join, parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { AddAttachmentDto } from '../dto';
import { TaskAttachmentService } from '../services';
import { TaskAttachmentApiType } from '../types';

import type { Response } from 'express';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskAttachmentController {
  SERVER_URL = 'http://localhost:3000/';
  constructor(private readonly taskAttachmentService: TaskAttachmentService) {}

  @Post('tasks-attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tasks-attachments',
        filename: (req, file, cb) => cb(null, uuidv4()),
      }),
    }),
  )
  async addTaskAttachment(
    @User('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() addAttachmentDto: AddAttachmentDto,
  ): Promise<Data<TaskAttachmentApiType>> {
    const data = await this.taskAttachmentService.addTaskAttachment(
      userId,
      addAttachmentDto.task_id,
      {
        id: parse(file.path).name,
        url: `${this.SERVER_URL}${file.path}`,
        mimetype: file.mimetype,
        type: addAttachmentDto.type,
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

    const stream = createReadStream(join(process.cwd(), file.path));

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return new StreamableFile(stream);
  }
}
