import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../shared/classes';
import { TaskEntity } from '../../task/entities/task.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends AbstractEntity {
  @ApiProperty({ example: 'education' })
  @Column({ length: 32 })
  title: string;

  @ApiProperty({ example: '#ff6347' })
  @Column({ length: 8 })
  color: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.projects, { eager: true })
  owner: UserEntity;

  @ApiHideProperty()
  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
