import { ApiProperty } from '@nestjs/swagger';

import { CommentEntity } from '../../entities/comment.entity';

export class CommentApiDto extends CommentEntity {
  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  task_id: string;

  @ApiProperty({ example: 'f60c913b-0859-4797-8dea-c07409ffcf0d' })
  owner_id: string;
}
