import { ApiProperty } from '@nestjs/swagger';

import { TaskAttachmentEntity } from '../../entities/task-attachment.entity';

export class TaskAttachmentApiDto extends TaskAttachmentEntity {
  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  task_id: string;

  @ApiProperty({
    example: 'http://localhost:3000/api/v1/tasks-attachments/235781f7-1919-4441-b809-2ccc7618f943',
    // examples: [
    //   'http://localhost:3000/api/v1/tasks-attachments/fb855677-1e31-410c-9e2f-4782c143604b',
    //   'https://intern1.dev2.cogniteq.com/api/v1/tasks-attachments/fb855677-1e31-410c-9e2f-4782c143604b',
    // ],
  })
  url: string;
}
