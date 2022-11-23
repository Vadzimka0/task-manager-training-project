import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateIf, ValidateNested } from 'class-validator';

import { ChecklistDto } from './checklist.dto';
import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class CreateChecklistDto extends ChecklistDto {
  @ApiProperty({ enum: CreateChecklistItemDto })
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  @IsDefined({ message: "Field 'items' is required, but it was missing" })
  @ValidateIf((_, value) => value !== null)
  readonly items: CreateChecklistItemDto[] | null;
}
