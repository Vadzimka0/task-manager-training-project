import { IsNotEmpty } from 'class-validator';

import { RegisterDto } from '../../auth/dto/register.dto';

export class CreateUserDto extends RegisterDto {
  @IsNotEmpty()
  readonly password: string;
}
