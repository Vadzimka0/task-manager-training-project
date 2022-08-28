import { ProjectEntity } from '../entities/project.entity';

export type ProjectApiType = ProjectEntity & {
  owner_id: string;
};
