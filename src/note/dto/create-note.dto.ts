import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

import { ColorEnum } from '../../common/enums';

export class CreateNoteDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly description: string;

  @IsEnum(ColorEnum)
  readonly color: ColorEnum;
}
