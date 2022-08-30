import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskAttachmentEntity } from '../entities';
import { TaskAttachmentApiType } from '../types';
import { TaskService } from './task.service';

@Injectable()
export class TaskAttachmentService {
  constructor(
    @InjectRepository(TaskAttachmentEntity)
    private readonly taskAttachmentRepository: Repository<TaskAttachmentEntity>,
    private readonly taskService: TaskService,
  ) {}

  async addTaskAttachment(
    userId: string,
    task_id: string,
    filedata: any,
  ): Promise<TaskAttachmentApiType> {
    const currentTask = await this.taskService.getValidTask(userId, task_id);

    const newTaskAttachment = new TaskAttachmentEntity();
    Object.assign(newTaskAttachment, filedata);
    newTaskAttachment.task = currentTask;

    const savedAttachment = await this.taskAttachmentRepository.save(newTaskAttachment);
    return this.getAttachmentWithTaskId(savedAttachment as TaskAttachmentApiType);
  }

  async getFileById(id: string) {
    // TODO: handle error
    return await this.taskAttachmentRepository.findOneBy({ id });
  }

  getAttachmentWithTaskId(attachment: TaskAttachmentApiType): TaskAttachmentApiType {
    attachment.task_id = attachment.task.id;
    return attachment;
  }
}
