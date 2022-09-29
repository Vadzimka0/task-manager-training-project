import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteChecklistItemsDto {
  @ApiProperty({
    description: 'Checklist items IDs list',
    example: ['55929fc1-2bfe-410f-b595-f7669912d97f', 'bfd66544-1d0b-4096-a4c0-f1c38fdc0d21'],
  })
  @IsNotEmpty()
  @IsArray()
  readonly items: string[];
}
