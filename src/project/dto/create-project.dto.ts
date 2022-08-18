import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

import { ColorEnum } from '../../common/enums';

export class CreateProjectDto {
  @IsNotEmpty()
  @MaxLength(32)
  readonly title: string;

  @IsEnum(ColorEnum)
  readonly color: ColorEnum;
}
