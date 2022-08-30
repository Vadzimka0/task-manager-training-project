import { TaskAttachmentEntity } from '../entities/task-attachment.entity';

export type TaskAttachmentApiType = TaskAttachmentEntity & {
  task_id: string;
};
