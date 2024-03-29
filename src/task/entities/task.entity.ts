import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../shared/classes';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserApiDto } from '../../user/dto/user-api.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { TaskAttachmentApiDto } from '../dto/api-dto/task-attachment-api.dto';
import { CommentEntity } from './comment.entity';
import { TaskAttachmentEntity } from './task-attachment.entity';

@Entity({ name: 'tasks' })
export class TaskEntity extends AbstractEntity {
  @ApiProperty({ example: 'learn Spanish' })
  @Column({ length: 256 })
  title: string;

  @ApiProperty({ example: 'practice with a tutor' })
  @Column()
  description: string;

  @ApiProperty({ example: '2024-01-25T11:00:00' })
  @Column()
  due_date: string;
  // due_date: Date;

  @ApiProperty({ example: false })
  @Column()
  is_completed: boolean;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { eager: true, onDelete: 'CASCADE' })
  project: ProjectEntity;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.assigned_tasks, { eager: true, nullable: true })
  performer: UserEntity;

  @ApiProperty({ type: () => [UserApiDto], nullable: true })
  @ManyToMany(() => UserEntity, (user) => user.participate_tasks, { eager: true })
  @JoinTable()
  members: UserEntity[];

  @ApiHideProperty()
  @OneToMany(() => CommentEntity, (comment) => comment.task)
  comments: CommentEntity[];

  @ApiProperty({ type: () => [TaskAttachmentApiDto], nullable: true })
  @OneToMany(() => TaskAttachmentEntity, (attachment) => attachment.task, {
    eager: true,
  })
  attachments: TaskAttachmentEntity[];

  @BeforeInsert()
  setDueDate() {
    this.due_date = this.due_date.slice(0, 16);
  }
}
