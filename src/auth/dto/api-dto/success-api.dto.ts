import { ApiProperty } from '@nestjs/swagger';

export class SuccessApiDto {
  @ApiProperty({ example: true })
  success: boolean;
}
