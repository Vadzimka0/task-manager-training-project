import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'rogerfederer@gmail.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Y29nbml0ZXE=' })
  @IsNotEmpty()
  readonly password: string;
}
