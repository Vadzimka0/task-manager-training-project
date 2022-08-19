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

  @IsOptional()
  readonly tag: string;

  @IsOptional()
  readonly performer: string;

  @IsOptional()
  @IsArray()
  readonly members?: string[];

  @IsOptional()
  @IsArray()
  readonly attachments?: string[];
}
