import { ProjectEntity } from '../entities/project.entity';

export interface ProjectsResponseInterface {
  projects: ProjectEntity[];
  projectsCount: number;
}
