import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { CommentEntity } from './entities/comment.entity';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
  imports: [UserModule, ProjectModule, TypeOrmModule.forFeature([TaskEntity, CommentEntity])],
  controllers: [TaskController, CommentController],
  providers: [TaskService, CommentService],
})
export class TaskModule {}
