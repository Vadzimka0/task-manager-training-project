import { TaskAttachmentEntity } from '../entities/task-attachment.entity';

export type TaskAttachmentData = Omit<
  TaskAttachmentEntity,
  'created_at' | 'task' | 'setTypeToUpperCase'
>;
