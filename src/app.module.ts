import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ChecklistModule } from './checklist/checklist.module';
import { DatabaseModule } from './database/database.module';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    NoteModule,
    ChecklistModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
