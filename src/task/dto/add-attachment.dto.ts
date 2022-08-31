import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { FileTypeEnum } from '../../common/enums/file-type.enum';

export class AddAttachmentDto {
  @IsEnum(FileTypeEnum)
  readonly type: FileTypeEnum;

  @IsNotEmpty()
  @IsUUID()
  readonly task_id: string;
}
