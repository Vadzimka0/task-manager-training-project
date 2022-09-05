import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ChecklistModule } from './checklist/checklist.module';
import { DatabaseModule } from './database/database.module';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    DatabaseModule,
    UserModule,
    AuthModule,
    NoteModule,
    ChecklistModule,
    ProjectModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
