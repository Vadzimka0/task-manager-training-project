import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { UserEntity } from '../../user/entities/user.entity';
import { CommentAttachmentEntity } from './comment-attachment.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {
  @Column({ length: 1024 })
  content: string;

  @Exclude()
  @ManyToOne(() => TaskEntity, (task) => task.comments, { eager: true, onDelete: 'CASCADE' })
  task: TaskEntity;

  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.comments, { eager: true })
  owner: UserEntity;

  @OneToMany(() => CommentAttachmentEntity, (attachment) => attachment.comment)
  attachments: CommentAttachmentEntity[];
}
