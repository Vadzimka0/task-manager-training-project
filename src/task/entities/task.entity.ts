import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { StatusEnum } from '../../common/enums';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'tasks' })
export class TaskEntity extends AbstractEntity {
  @Column({ length: 256 })
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column({ default: StatusEnum.PENDING })
  status: StatusEnum;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { eager: true })
  tag: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, { eager: true })
  performer: UserEntity;

  @ManyToMany(() => UserEntity, { eager: true })
  @JoinTable()
  members: UserEntity[];

  // @ManyToOne(() => UserEntity, (owner) => owner.createdTasks, { eager: true })
  // owner: UserEntity;
}
