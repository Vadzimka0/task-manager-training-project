import { IsArray, IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { ColorEnum } from '../../common/enums';

export class CreateChecklistDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly title: string;

  @IsEnum(ColorEnum)
  readonly color: ColorEnum;

  @IsOptional()
  @IsArray()
  readonly itemsTitles?: string[];
}
