import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Has to be no more than 1024 characters',
    example: 'first comment',
  })
  @IsNotEmpty()
  @MaxLength(1024)
  readonly content: string;

  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @IsNotEmpty()
  @IsUUID()
  readonly task_id: string;

  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;
}
