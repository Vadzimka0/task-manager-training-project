import { ApiProperty } from '@nestjs/swagger';

export type ProjectStatisticApiType = {
  project_id: string;
  tasks_number: number;
};

export class ProjectStatisticApiDto {
  @ApiProperty({
    description: 'project id',
    example: 'd091f63d-157f-4835-9038-e33d3e996fb7',
  })
  project_id: string;

  @ApiProperty({
    description: 'tasks count',
    example: 1,
  })
  tasks_number: number;
}
