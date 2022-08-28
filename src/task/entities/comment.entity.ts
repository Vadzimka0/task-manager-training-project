import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { UserEntity } from '../../user/entities/user.entity';
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
}
