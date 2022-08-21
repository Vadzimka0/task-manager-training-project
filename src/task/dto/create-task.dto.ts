import { IsArray, IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { StatusEnum } from '../../common/enums';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(256)
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly dueDate: Date;

  @IsOptional()
  @IsEnum(StatusEnum)
  readonly status: StatusEnum;

  @IsNotEmpty()
  readonly tag: { title: string };
  // readonly tag: string;

  @IsOptional()
  readonly assignedTo: string;

  @IsOptional()
  @IsArray()
  readonly members?: string[];

  @IsOptional()
  @IsArray()
  readonly attachments?: string[];
}
