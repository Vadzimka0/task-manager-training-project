import { ApiProperty } from '@nestjs/swagger';

import { SignUpDto } from '../../auth/dto/sign-up.dto';

// export class UserApiDto extends UserEntity {
//   @ApiProperty({
//     example: 'http://localhost:3000/api/v1/users-avatar/fb4cad39-9add-4633-8050-b933ad1d7458',
//   })
//   avatar_url: string;
// }

export class UserApiDto extends SignUpDto {
  @ApiProperty({ example: 'fb4cad39-9add-4633-8050-b933ad1d7458' })
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({
    example: 'http://localhost:3000/api/v1/users-avatar/fb4cad39-9add-4633-8050-b933ad1d7458',
  })
  avatar_url: string;
}
