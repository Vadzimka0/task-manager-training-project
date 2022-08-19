import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { ColorEnum } from '../../common/enums';
import { TaskEntity } from '../../task/entities/task.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends AbstractEntity {
  @Column({ length: 32 })
  title: string;

  @Column()
  color: ColorEnum;

  @Exclude()
  @ManyToOne(() => UserEntity, (author) => author.projects, { eager: true })
  author: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.tag)
  tasks?: TaskEntity[];
}
