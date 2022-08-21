import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ChecklistEntity } from '../../checklist/entities/checklist.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { TaskEntity } from '../../task/entities/task.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.author)
  projects?: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.performer)
  assignedTasks?: TaskEntity[];

  @OneToMany(() => NoteEntity, (note: NoteEntity) => note.author)
  notes?: NoteEntity[];

  @OneToMany(() => ChecklistEntity, (checklist: ChecklistEntity) => checklist.author)
  checklists?: ChecklistEntity[];

  // @OneToMany(() => TaskEntity, (task: TaskEntity) => task.author)
  // createdTasks?: TaskEntity[];
}
