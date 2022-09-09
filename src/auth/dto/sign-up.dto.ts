import { IsBase64, IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsBase64()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly username: string;
}
