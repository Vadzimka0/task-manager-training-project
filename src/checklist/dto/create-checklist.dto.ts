import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class ChecklistDto {
  @ApiProperty({
    description: 'Has to be no more than 512 characters',
    example: 'buy car',
  })
  @IsNotEmpty()
  @MaxLength(512)
  readonly title: string;

  @ApiProperty({
    description: 'Has to match a HEX color (7 characters)',
    example: '#00FFFF',
  })
  @IsNotEmpty()
  readonly color: string;

  @ApiProperty({
    description: 'Should be an ID of a USER that exists in the database',
    example: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  })
  @IsUUID()
  readonly owner_id: string;
}

export class CreateChecklistDto extends ChecklistDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  @IsDefined({ message: "Field 'items' is required, but it was missing" })
  @ValidateIf((_, value) => value !== null)
  readonly items: CreateChecklistItemDto[] | null;
}
