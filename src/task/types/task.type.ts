import { TaskEntity } from '../entities/task.entity';

export type TaskType = TaskEntity & {
  owner_id: string;
  project_id: string;
  assigned_to: string;
};
