import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ChecklistDto } from './create-checklist.dto';
import { UpdateChecklistItemDto } from './update-checklist-item.dto';

export class UpdateChecklistDto extends ChecklistDto {
  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  @IsOptional()
  readonly items: UpdateChecklistItemDto[] | null;
}
