import { ApiProperty } from '@nestjs/swagger';

import { TaskEntity } from '../../entities/task.entity';

export class TaskApiDto extends TaskEntity {
  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  owner_id: string;

  @ApiProperty({ example: 'b905021b-59e1-4c4a-a7e2-ee80fa4ef38e' })
  project_id: string;

  @ApiProperty({ example: '86fd5b28-eb9b-4c31-b19c-209a7ab050a4', nullable: true })
  assigned_to: string;
}
