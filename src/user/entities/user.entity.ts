import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChecklistEntity } from '../../checklist/entities/checklist.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { CommentEntity } from '../../task/entities/comment.entity';
import { TaskEntity } from '../../task/entities/task.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.owner)
  notes: NoteEntity[];

  @OneToMany(() => ChecklistEntity, (checklist: ChecklistEntity) => checklist.owner)
  checklists: ChecklistEntity[];

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.owner)
  projects: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.performer)
  assigned_tasks: TaskEntity[];

  @ManyToMany(() => TaskEntity, (task: TaskEntity) => task.members)
  participate_tasks: TaskEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.owner)
  comments: CommentEntity[];

  @Exclude()
  @Column({ nullable: true })
  mimetype: string;

  @Exclude()
  @Column({ nullable: true })
  path: string;

  @Exclude()
  @Column({ nullable: true })
  filename: string;
}
