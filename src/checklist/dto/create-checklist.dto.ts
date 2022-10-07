import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateNested } from 'class-validator';

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
  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  @IsOptional()
  readonly items: CreateChecklistItemDto[] | null;
}
