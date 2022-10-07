import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'rogerfederer@gmail.com' })
  readonly email: string;

  @ApiProperty({ example: 'Y29nbml0ZXE=' })
  readonly password: string;
}
