import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChecklistItemDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly content: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;
}
