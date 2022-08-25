import { ProjectEntity } from '../entities/project.entity';

export type ProjectType = ProjectEntity & {
  owner_id: string;
};
