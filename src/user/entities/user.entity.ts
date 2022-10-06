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
  // @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  // @ApiProperty()
  @Column({ unique: true })
  email: string;

  // @ApiProperty()
  @Column()
  username: string;

  // @ApiHideProperty()
  @Exclude()
  @Column()
  password: string;

  // @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  refresh_token: string;

  // @ApiHideProperty()
  @OneToMany(() => NoteEntity, (note) => note.owner)
  notes: NoteEntity[];

  // @ApiHideProperty()
  @OneToMany(() => ChecklistEntity, (checklist) => checklist.owner)
  checklists: ChecklistEntity[];

  // @ApiHideProperty()
  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects: ProjectEntity[];

  // @ApiHideProperty()
  @OneToMany(() => TaskEntity, (task) => task.performer)
  assigned_tasks: TaskEntity[];

  // @ApiHideProperty()
  @ManyToMany(() => TaskEntity, (task) => task.members)
  participate_tasks: TaskEntity[];

  // @ApiHideProperty()
  @OneToMany(() => CommentEntity, (comment) => comment.owner)
  comments: CommentEntity[];

  // @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  mimetype: string;

  // @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  path: string;

  // @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  filename: string;
}
