import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class ChecklistItemDto {
  @ApiProperty({
    description: 'Has to be no more than 512 characters',
    example: 'visit car dealerships',
  })
  @IsNotEmpty()
  @MaxLength(512)
  readonly content: string;

  @ApiProperty({
    description: 'Has to match a boolean value',
    example: false,
  })
  @IsBoolean()
  readonly is_completed: boolean;
}
