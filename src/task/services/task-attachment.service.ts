import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddTaskAttachmentDto } from '../dto';
import { TaskAttachmentEntity } from '../entities';
import { TaskAttachmentApiType } from '../types';
import { TaskService } from './task.service';

@Injectable()
export class TaskAttachmentService {
  private server_url: string;

  constructor(
    @InjectRepository(TaskAttachmentEntity)
    private readonly taskAttachmentRepository: Repository<TaskAttachmentEntity>,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}/${this.configService.get(
      'URL_PREFIX_PATH',
    )}/`;
  }

  async addTaskAttachment(
    userId: string,
    addTaskAttachmentDto: AddTaskAttachmentDto,
    file: Express.Multer.File,
  ): Promise<TaskAttachmentApiType> {
    const currentTask = await this.taskService.getValidTask(userId, addTaskAttachmentDto.task_id);

    const filedata = {
      id: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      filename: file.originalname,
      type: addTaskAttachmentDto.type,
    };

    const newTaskAttachment = new TaskAttachmentEntity();
    Object.assign(newTaskAttachment, filedata);
    newTaskAttachment.task = currentTask;
    const savedAttachment = await this.taskAttachmentRepository.save(newTaskAttachment);

    return this.getFullTaskAttachment(savedAttachment as TaskAttachmentApiType);
  }

  async getFileById(id: string) {
    const file = await this.taskAttachmentRepository.findOneBy({ id });

    if (!file) {
      throw new NotFoundException(`Entity TaskAttachmentModel, id=${id} not found in the database`);
    }

    return file;
  }

  getFullTaskAttachment(attachment: TaskAttachmentApiType): TaskAttachmentApiType {
    attachment.task_id = attachment.task.id;
    attachment.url = `${this.server_url}${attachment.path.substring(
      attachment.path.indexOf('/') + 1,
    )}`;

    return attachment;
  }
}
