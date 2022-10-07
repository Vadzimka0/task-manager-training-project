import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { Express } from 'express';

import { FileTypeEnum } from '../../common/enums/file-type.enum';

export class AddTaskAttachmentDto {
  @ApiProperty({ enum: ['image', 'file'] })
  @IsEnum(FileTypeEnum)
  readonly type: FileTypeEnum;

  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @IsUUID()
  readonly task_id: string;
}

export class FileUploadDto extends AddTaskAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
