import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '../entities/project.entity';

export type ProjectApiType = ProjectEntity & {
  owner_id: string;
};

export class Project extends ProjectEntity {
  @ApiProperty()
  owner_id: string;
}
