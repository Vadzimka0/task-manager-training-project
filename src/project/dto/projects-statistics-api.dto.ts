import { ApiProperty } from '@nestjs/swagger';

export class ProjectStatisticApiDto {
  @ApiProperty({ example: 'd091f63d-157f-4835-9038-e33d3e996fb7' })
  project_id: string;

  @ApiProperty({ example: 1 })
  tasks_number: number;
}
