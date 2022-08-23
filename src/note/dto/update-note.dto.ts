import { IsBoolean, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly description: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;
}
