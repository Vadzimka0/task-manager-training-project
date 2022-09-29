import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ChecklistDto } from './create-checklist.dto';
import { UpdateChecklistItemDto } from './update-checklist-item.dto';

export class UpdateChecklistDto extends ChecklistDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  readonly items: UpdateChecklistItemDto[] | null;
}
