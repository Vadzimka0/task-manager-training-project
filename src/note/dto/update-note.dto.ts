import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { ColorEnum, StatusEnum } from '../../common/enums';

export class UpdateNoteDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(512)
  readonly description: string;

  @IsOptional()
  @IsEnum(ColorEnum)
  readonly color: ColorEnum;

  @IsOptional()
  @IsEnum(StatusEnum)
  readonly status: StatusEnum;
}
