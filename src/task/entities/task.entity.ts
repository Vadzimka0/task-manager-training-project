import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { CommentEntity, TaskAttachmentEntity } from '.';
import { AbstractEntity } from '../../common/abstract-entity-class';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '../../user/entities/user.entity';

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
  @ManyToOne(() => UserEntity, (user) => user.assigned_tasks, { eager: true })
  performer: UserEntity;

  @Exclude()
  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { eager: true, onDelete: 'CASCADE' })
  project: ProjectEntity;

  @ManyToMany(() => UserEntity, (user) => user.participate_tasks, { eager: true })
  @JoinTable()
  members: UserEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.task)
  comments: CommentEntity[];

  @OneToMany(() => TaskAttachmentEntity, (attachment: TaskAttachmentEntity) => attachment.task)
  attachments: TaskAttachmentEntity[];
}
