import { ApiProperty } from '@nestjs/swagger';

import { CreateProjectDto } from './create-project.dto';

export class ProjectApiDto extends CreateProjectDto {
  @ApiProperty({
    description: 'Project ID',
    example: '6d2e0a12-739e-4a03-a570-606aa4fc686c',
  })
  readonly id: string;

  @ApiProperty()
  readonly created_at: Date;
}
