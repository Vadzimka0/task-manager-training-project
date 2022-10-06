import { ApiProperty } from '@nestjs/swagger';

export class UserStatisticsApiDto {
  @ApiProperty({ example: 5 })
  created_tasks: number;

  @ApiProperty({ example: 3 })
  completed_tasks: number;

  @ApiProperty({ example: '60%' })
  events: string;

  @ApiProperty({ example: '0%' })
  quick_notes: string;

  @ApiProperty({ example: '17%' })
  todo: string;
}
