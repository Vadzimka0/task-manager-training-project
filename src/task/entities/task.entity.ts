import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

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
  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, { eager: true })
  performer: UserEntity;

  @Exclude()
  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { eager: true })
  project: ProjectEntity;

  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable()
  members: UserEntity[];

  // @ManyToOne(() => UserEntity, (owner) => owner.createdTasks, { eager: true })
  // owner: UserEntity;
}
