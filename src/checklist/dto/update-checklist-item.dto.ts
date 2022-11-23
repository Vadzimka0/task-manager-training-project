import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateIf } from 'class-validator';

import { ChecklistItemDto } from './checklist-item.dto';

export class UpdateChecklistItemDto extends ChecklistItemDto {
  // export class UpdateChecklistItemDto {
  //   @ApiProperty({
  //     description: 'Has to be no more than 512 characters',
  //     example: 'visit car dealerships',
  //   })
  //   @IsNotEmpty()
  //   @MaxLength(512)
  //   readonly content: string;

  //   @ApiProperty({
  //     description: 'Has to match a boolean value',
  //     example: false,
  //   })
  //   @IsBoolean()
  //   readonly is_completed: boolean;

  @ApiProperty({
    description: 'Should be an ID of a checklist item that exists in the database OR null',
    example: '55929fc1-2bfe-410f-b595-f7669912d97f',
  })
  @IsDefined({ message: "Field 'id' is required, but it was missing" })
  @ValidateIf((_, value) => value !== null)
  readonly id: string | null;
}
