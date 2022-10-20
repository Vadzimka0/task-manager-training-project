import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddTaskAttachmentDto } from '../dto/add-task-attachment.dto';
import { TaskAttachmentApiDto } from '../dto/api-dto/task-attachment-api.dto';
import { TaskAttachmentEntity } from '../entities/task-attachment.entity';
import { TaskService } from './task.service';

@Injectable()
export class TaskAttachmentService {
  private server_url: string;

  /**
   * @ignore
   */
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

  /**
   * A method that create a task attachment in the database
   * @param userId An userId from JWT
   */
  async addTaskAttachment(
    userId: string,
    addTaskAttachmentDto: AddTaskAttachmentDto,
    file: Express.Multer.File,
  ): Promise<TaskAttachmentEntity> {
    const currentTask = await this.taskService.getValidTaskForEdit(
      userId,
      addTaskAttachmentDto.task_id,
    );

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

    return this.taskAttachmentRepository.save(newTaskAttachment);
  }

  /**
   * A method that fetches task attachment from the database
   * @param id An id from attachment
   */
  async fetchFileById(id: string) {
    const file = await this.taskAttachmentRepository.findOneBy({ id });

    if (!file) {
      throw new InternalServerErrorException(
        `Entity TaskAttachmentModel, id=${id} not found in the database`,
      );
    }

    return file;
  }

  /**
   * A method that adds properties task_id and url to TaskAttachment according to the requirements
   */
  getRequiredFormatTaskAttachment(attachment: TaskAttachmentApiDto): TaskAttachmentApiDto {
    attachment.task_id = attachment.task.id;
    attachment.url = `${this.server_url}${attachment.path.substring(
      attachment.path.indexOf('/') + 1,
    )}`;

    return attachment;
  }
}
