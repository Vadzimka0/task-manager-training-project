import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.owner)
  projects?: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.performer)
  assignedTasks?: TaskEntity[];

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.owner)
  notes?: NoteEntity[];

  @OneToMany(() => ChecklistEntity, (checklist: ChecklistEntity) => checklist.owner)
  checklists?: ChecklistEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.owner)
  comments?: CommentEntity[];

  // @OneToMany(() => TaskEntity, (task: TaskEntity) => task.owner)
  // createdTasks?: TaskEntity[];
}
