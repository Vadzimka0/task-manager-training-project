import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignOutDto {
  @ApiProperty({ example: 'rogerfederer@gmail.com' })
  @IsEmail()
  readonly email: string;
}
