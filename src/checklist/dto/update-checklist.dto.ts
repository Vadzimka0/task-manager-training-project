import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateIf, ValidateNested } from 'class-validator';

import { ChecklistDto } from './checklist.dto';
import { UpdateChecklistItemDto } from './update-checklist-item.dto';

export class UpdateChecklistDto extends ChecklistDto {
  @ApiProperty({ enum: UpdateChecklistItemDto })
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  @IsDefined({ message: "Field 'items' is required, but it was missing" })
  @ValidateIf((_, value) => value !== null)
  readonly items: UpdateChecklistItemDto[] | null;
}
