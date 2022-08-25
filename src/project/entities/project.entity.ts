import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { TaskEntity } from '../../task/entities/task.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends AbstractEntity {
  @Column({ length: 32 })
  title: string;

  @Column({ length: 8 })
  color: string;

  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.projects, { eager: true })
  owner: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks?: TaskEntity[];
}
