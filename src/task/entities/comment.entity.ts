import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommentAttachmentEntity, TaskEntity } from '.';
import { AbstractEntity } from '../../common/classes';
import { UserEntity } from '../../user/entities/user.entity';

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

  @OneToMany(
    () => CommentAttachmentEntity,
    (attachment: CommentAttachmentEntity) => attachment.comment,
  )
  attachments: CommentAttachmentEntity[];
}
