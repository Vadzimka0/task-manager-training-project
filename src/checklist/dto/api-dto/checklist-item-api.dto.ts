import { ApiProperty } from '@nestjs/swagger';

import { ChecklistItemEntity } from '../../entities/checklistItem.entity';

export class ChecklistItemApiDto extends ChecklistItemEntity {
  @ApiProperty({ example: 'd091f63d-157f-4835-9038-e33d3e996fb7' })
  checklist_id: string;
}
