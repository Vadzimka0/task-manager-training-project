import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { ColorEnum } from '../../common/enums';

export class UpdateProjectDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(32)
  readonly title: string;

  @IsOptional()
  @IsEnum(ColorEnum)
  readonly color: ColorEnum;
}
