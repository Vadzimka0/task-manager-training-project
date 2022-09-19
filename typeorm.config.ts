import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ChecklistEntity, ChecklistItemEntity } from './src/checklist/entities';
import { NoteEntity } from './src/note/entities/note.entity';
import { ProjectEntity } from './src/project/entities/project.entity';
import { CommentAttachmentEntity, CommentEntity, TaskAttachmentEntity } from './src/task/entities';
import { TaskEntity } from './src/task/entities/task.entity';
import { UserEntity } from './src/user/entities/user.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  // entities: [__dirname + '/**/entities/*.entity{.js,.ts}'],
  entities: [
    UserEntity,
    NoteEntity,
    ChecklistEntity,
    ChecklistItemEntity,
    ProjectEntity,
    TaskEntity,
    TaskAttachmentEntity,
    CommentEntity,
    CommentAttachmentEntity,
  ],
  migrations: [__dirname + '/src/database/migrations/**/*{.js,.ts}'],
  namingStrategy: new SnakeNamingStrategy(),
});
