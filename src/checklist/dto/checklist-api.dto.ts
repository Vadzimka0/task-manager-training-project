import { ApiProperty } from '@nestjs/swagger';

import { CreateChecklistItemDto } from './create-checklist-item.dto';
import { ChecklistDto } from './create-checklist.dto';

export class ChecklistApiDto extends ChecklistDto {
  @ApiProperty({
    description: 'Checklist ID',
    example: 'd091f63d-157f-4835-9038-e33d3e996fb7',
  })
  readonly id: string;

  @ApiProperty()
  readonly created_at: Date;

  @ApiProperty({ type: () => [ChecklistItemApiDto] })
  readonly items: ChecklistItemApiDto[] | null;
}

class ChecklistItemApiDto extends CreateChecklistItemDto {
  @ApiProperty({
    description: 'Checklist item ID',
    example: '55929fc1-2bfe-410f-b595-f7669912d97f',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Checklist ID',
    example: 'd091f63d-157f-4835-9038-e33d3e996fb7',
  })
  readonly checklist_id: string;

  @ApiProperty()
  readonly created_at: Date;
}
