import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { FileTypeEnum } from '../../common/enums/file-type.enum';

export class AddCommentAttachmentDto {
  @IsEnum(FileTypeEnum)
  readonly type: FileTypeEnum;

  @IsNotEmpty()
  @IsUUID()
  readonly comment_id: string;
}

export class CommentFileUploadDto extends AddCommentAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
