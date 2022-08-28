import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(1024)
  readonly content: string;

  @IsNotEmpty()
  @IsUUID()
  readonly task_id: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;
}
