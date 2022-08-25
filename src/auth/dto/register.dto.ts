import { IsBase64, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsBase64()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  readonly username: string;

  // @IsOptional()
  // readonly photo: string;
}
