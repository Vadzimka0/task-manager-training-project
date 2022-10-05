import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'rogerfederer@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiHideProperty()
  @IsBase64()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'fedex' })
  @IsNotEmpty()
  readonly username: string;
}
