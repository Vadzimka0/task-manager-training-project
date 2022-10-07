import { ApiProperty } from '@nestjs/swagger';

export class UserSessionApiDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZEBnbWFpbC5jb20iLCJpYXQiOjE2NjUxMzY2MDMsImV4cCI6MTY2NTMwOTQwM30.W8tmb_3wffspHDL2nE3oHxBBiT744_kCkal7PtYevag',
  })
  access_token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZEBnbWFpbC5jb20iLCJpYXQiOjE2NjUxMzY2MDMsImV4cCI6MTY2NTc0MTQwM30.0O9ergfd1sTTg5RoGY0PayYuVqdnUHc_9Ds42WZKVtA',
  })
  refresh_token: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({ example: 1665309403457 })
  expires_in: number;
}
