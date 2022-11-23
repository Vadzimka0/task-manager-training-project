import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddCommentAttachmentDto {
  @ApiProperty({ enum: ['image', 'file'] })
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @IsUUID()
  readonly comment_id: string;
}

export class CommentFileUploadDto extends AddCommentAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
