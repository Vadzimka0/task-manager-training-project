import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { StatusEnum } from '../../common/enums';

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(512)
  readonly itemTitle: string;

  @IsEnum(StatusEnum)
  readonly status: StatusEnum;
}
