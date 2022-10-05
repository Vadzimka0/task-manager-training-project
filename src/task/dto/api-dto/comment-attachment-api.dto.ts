import { ApiProperty } from '@nestjs/swagger';

import { CommentAttachmentEntity } from '../../entities/comment-attachment.entity';

export class CommentAttachmentApiDto extends CommentAttachmentEntity {
  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  comment_id: string;

  @ApiProperty({
    example:
      'http://localhost:3000/api/v1/comments-attachments/5cb5594e-b18d-45e9-bc32-4d97ef16f6af',
    // examples: [
    //   'http://localhost:3000/api/v1/comments-attachments/5cb5594e-b18d-45e9-bc32-4d97ef16f6af',
    //   'https://intern1.dev2.cogniteq.com/api/v1/comments-attachments/5cb5594e-b18d-45e9-bc32-4d97ef16f6af',
    // ],
  })
  url: string;
}
