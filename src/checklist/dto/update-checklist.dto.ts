import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateNested } from 'class-validator';

import { UpdateChecklistItemDto } from './update-checklist-item.dto';

export class UpdateChecklistDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly title: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  readonly items: UpdateChecklistItemDto[] | null;
}
