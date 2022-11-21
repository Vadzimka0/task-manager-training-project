import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddAvatarDto {
  @ApiProperty({ example: 'fb4cad39-9add-4633-8050-b933ad1d7458' })
  @IsNotEmpty()
  readonly user_id: string;
}

export class AvatarUploadDto extends AddAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
