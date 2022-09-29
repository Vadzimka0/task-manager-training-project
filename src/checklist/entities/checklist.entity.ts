import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { UserEntity } from '../../user/entities/user.entity';
import { ChecklistItemEntity } from './checklistItem.entity';

@Entity({ name: 'checklists' })
export class ChecklistEntity extends AbstractEntity {
  @Column({ length: 512 })
  title: string;

  @Column({ length: 8 })
  color: string;

  @OneToMany(() => ChecklistItemEntity, (item: ChecklistItemEntity) => item.checklist, {
    eager: true,
  })
  items: ChecklistItemEntity[];

  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.checklists, { eager: true })
  owner: UserEntity;
}
