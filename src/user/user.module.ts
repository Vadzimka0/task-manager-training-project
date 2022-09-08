import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteModule } from '../note/note.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { UserAvatarController } from './controllers/user-avatar.controller';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserAvatarService } from './services/user-avatar.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ProjectModule,
    NoteModule,
    forwardRef(() => TaskModule),
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController, UserAvatarController],
  providers: [UserService, UserAvatarService],
  exports: [UserService],
})
export class UserModule {}
