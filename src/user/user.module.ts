import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsService } from '../common/services/utils.service';
import { NoteModule } from '../note/note.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { UserAvatarController, UserController } from './controllers';
import { UserEntity } from './entities/user.entity';
import { UserAvatarService, UserService } from './services';

@Module({
  imports: [
    forwardRef(() => TaskModule),
    ProjectModule,
    NoteModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController, UserAvatarController],
  providers: [UserService, UserAvatarService, UtilsService],
  exports: [UserService, UserAvatarService],
})
export class UserModule {}
