import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, ValidateIf } from 'class-validator';

import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class UpdateChecklistItemDto extends CreateChecklistItemDto {
  @ApiProperty({
    description: 'Should be an ID of a checklist item that exists in the database OR null',
    example: '55929fc1-2bfe-410f-b595-f7669912d97f',
  })
  // @IsUUID()
  @IsDefined({ message: "Field 'id' is required, but it was missing" })
  @ValidateIf((_, value) => value !== null)
  readonly id: string | null;
}
