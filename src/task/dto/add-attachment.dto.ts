import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddAttachmentDto {
  @IsNotEmpty()
  // TODO: Enum
  readonly type: string;

  @IsNotEmpty()
  @IsUUID()
  readonly task_id: string;
}
