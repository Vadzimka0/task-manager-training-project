import { IsBoolean, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @IsNotEmpty()
  @MaxLength(512)
  readonly content: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;
}
