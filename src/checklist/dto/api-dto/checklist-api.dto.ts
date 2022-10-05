import { ApiProperty } from '@nestjs/swagger';

import { ChecklistEntity } from '../../entities/checklist.entity';

export class ChecklistApiDto extends ChecklistEntity {
  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  owner_id: string;
}
