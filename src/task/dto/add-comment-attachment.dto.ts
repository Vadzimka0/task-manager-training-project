import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

import { FileTypeEnum } from '../../common/enums/file-type.enum';

export class AddCommentAttachmentDto {
  @ApiProperty({ enum: ['image', 'file'] })
  @IsEnum(FileTypeEnum)
  readonly type: FileTypeEnum;

  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @IsUUID()
  readonly comment_id: string;
}

export class CommentFileUploadDto extends AddCommentAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
