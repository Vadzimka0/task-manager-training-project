import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { ColorEnum } from '../../common/enums';

export class UpdateChecklistDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(512)
  readonly title: string;

  @IsOptional()
  @IsEnum(ColorEnum)
  readonly color: ColorEnum;
}
