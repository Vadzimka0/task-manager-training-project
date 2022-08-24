import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateNested } from 'class-validator';

import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class CreateChecklistDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly title: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  readonly items: CreateChecklistItemDto[] | null;
}
