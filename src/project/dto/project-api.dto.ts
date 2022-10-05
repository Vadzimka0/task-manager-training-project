import { ApiProperty } from '@nestjs/swagger';

import { ProjectEntity } from '../entities/project.entity';

export class ProjectApiDto extends ProjectEntity {
  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  owner_id: string;
}
