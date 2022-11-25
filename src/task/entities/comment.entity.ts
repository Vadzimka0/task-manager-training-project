import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { UserEntity } from '../../user/entities/user.entity';
import { CommentAttachmentApiDto } from '../dto/api-dto/comment-attachment-api.dto';
import { CommentAttachmentEntity } from './comment-attachment.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'comments' })
// export class CommentEntity extends AbstractEntity {
export class CommentEntity {
  @ApiProperty({ example: '235781f7-1919-4441-b809-2ccc7618f943' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  created_at: string;

  @ApiProperty({ example: 'first comment' })
  @Column({ length: 1024 })
  content: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => TaskEntity, (task) => task.comments, { eager: true, onDelete: 'CASCADE' })
  task: TaskEntity;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity, (owner) => owner.comments, { eager: true })
  commentator: UserEntity;

  @ApiProperty({ type: () => [CommentAttachmentApiDto], nullable: true })
  @OneToMany(() => CommentAttachmentEntity, (attachment) => attachment.comment)
  attachments: CommentAttachmentEntity[];
}
