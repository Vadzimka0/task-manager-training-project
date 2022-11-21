import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'rogerfederer@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Y29nbml0ZXE=' })
  // @IsBase64()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'fedex' })
  @IsNotEmpty()
  readonly username: string;
}
