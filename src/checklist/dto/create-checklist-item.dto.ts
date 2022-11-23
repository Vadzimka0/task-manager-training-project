import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ChecklistItemDto } from './checklist-item.dto';

export class CreateChecklistItemDto extends ChecklistItemDto {
  @ApiPropertyOptional({
    description: 'Has to match null',
    example: 'null',
  })
  @IsOptional()
  readonly id: null;
}
