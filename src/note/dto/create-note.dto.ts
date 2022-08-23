import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly description: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;
}
