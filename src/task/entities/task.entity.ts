import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CommentEntity } from './comment.entity';
import { TaskAttachmentEntity } from './task-attachment.entity';

@Entity({ name: 'tasks' })
export class TaskEntity extends AbstractEntity {
  @Column({ length: 256 })
  title: string;

  @Column()
  description: string;

  @Column()
  due_date: Date;

  @Column()
  is_completed: boolean;

  @Exclude()
  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { eager: true, onDelete: 'CASCADE' })
  project: ProjectEntity;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.assigned_tasks, { eager: true, nullable: true })
  performer: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.participate_tasks, { eager: true })
  @JoinTable()
  members: UserEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.task)
  comments: CommentEntity[];

  @OneToMany(() => TaskAttachmentEntity, (attachment) => attachment.task, {
    eager: true,
  })
  attachments: TaskAttachmentEntity[];
}
