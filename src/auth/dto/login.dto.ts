import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  readonly email: string;

  // @IsBase64()
  readonly password: string;
}
