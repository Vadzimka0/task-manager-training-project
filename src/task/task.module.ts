import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import {
  CommentAttachmentController,
  CommentController,
  TaskAttachmentController,
  TaskController,
} from './controllers';
import {
  CommentAttachmentEntity,
  CommentEntity,
  TaskAttachmentEntity,
  TaskEntity,
} from './entities';
import {
  CommentAttachmentService,
  CommentService,
  TaskAttachmentService,
  TaskService,
} from './services';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ProjectModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      TaskEntity,
      CommentEntity,
      TaskAttachmentEntity,
      CommentAttachmentEntity,
    ]),
  ],
  controllers: [
    TaskController,
    CommentController,
    TaskAttachmentController,
    CommentAttachmentController,
  ],
  providers: [TaskService, CommentService, TaskAttachmentService, CommentAttachmentService],
  exports: [TaskService],
})
export class TaskModule {}
