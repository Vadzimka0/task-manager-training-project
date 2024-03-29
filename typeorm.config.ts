import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [__dirname + '/**/entities/*.entity{.js,.ts}'],
  // entities: [
  //   UserEntity,
  //   NoteEntity,
  //   ChecklistEntity,
  //   ChecklistItemEntity,
  //   ProjectEntity,
  //   TaskEntity,
  //   TaskAttachmentEntity,
  //   CommentEntity,
  //   CommentAttachmentEntity,
  // ],
  migrations: [__dirname + '/src/database/migrations/**/*{.js,.ts}'],
  namingStrategy: new SnakeNamingStrategy(),
});
