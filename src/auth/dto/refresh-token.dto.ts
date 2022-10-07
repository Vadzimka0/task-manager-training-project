import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZEBnbWFpbC5jb20iLCJpYXQiOjE2NjUxMzgzMDgsImV4cCI6MTY2NTc0MzEwOH0.cYmUgAKa7gcRY0QwToZtpryU0sBTz5p2hxxpkiWgxg0',
  })
  refresh_token: string;
}
