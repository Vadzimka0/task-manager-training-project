import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { ColorEnum } from '../../common/enums';
import { UserEntity } from '../../user/entities/user.entity';
import { ChecklistItemEntity } from './checklistItem.entity';

@Entity({ name: 'checklists' })
export class ChecklistEntity extends AbstractEntity {
  @Column({ length: 512 })
  title: string;

  @Column()
  color: ColorEnum;

  @OneToMany(() => ChecklistItemEntity, (item: ChecklistItemEntity) => item.checklist, {
    eager: true,
  })
  items?: ChecklistItemEntity[];

  @Exclude()
  @ManyToOne(() => UserEntity, (author) => author.checklists, { eager: true })
  author: UserEntity;
}
