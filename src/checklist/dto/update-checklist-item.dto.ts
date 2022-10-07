import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class UpdateChecklistItemDto extends CreateChecklistItemDto {
  @ApiPropertyOptional({
    description: 'Should be an ID of a checklist item that exists in the database OR null',
    example: '55929fc1-2bfe-410f-b595-f7669912d97f',
  })
  @IsOptional()
  @IsUUID()
  readonly id: string | null;
}
