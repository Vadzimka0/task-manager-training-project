import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { Express } from 'express';

export class AddTaskAttachmentDto {
  @ApiPropertyOptional({ enum: ['image', 'file'] })
  @IsOptional()
  readonly type: string;

  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @IsUUID()
  readonly task_id: string;
}

export class FileUploadDto extends AddTaskAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
