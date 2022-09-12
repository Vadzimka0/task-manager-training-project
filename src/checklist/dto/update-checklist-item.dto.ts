import { IsBoolean, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsUUID()
  readonly id: string | null;

  @IsNotEmpty()
  @MaxLength(512)
  readonly content: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;
}
