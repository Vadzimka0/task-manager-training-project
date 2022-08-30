import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { CommentController, TaskAttachmentController, TaskController } from './controllers';
import {
  CommentAttachmentEntity,
  CommentEntity,
  TaskAttachmentEntity,
  TaskEntity,
} from './entities';
import { CommentService, TaskAttachmentService, TaskService } from './services';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TypeOrmModule.forFeature([
      TaskEntity,
      CommentEntity,
      TaskAttachmentEntity,
      CommentAttachmentEntity,
    ]),
  ],
  controllers: [TaskController, CommentController, TaskAttachmentController],
  providers: [TaskService, CommentService, TaskAttachmentService],
})
export class TaskModule {}
