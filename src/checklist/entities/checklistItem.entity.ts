import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StatusEnum } from '../../common/enums';
import { ChecklistEntity } from './checklist.entity';

@Entity({ name: 'checklist_items' })
export class ChecklistItemEntity {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column({ length: 512 })
  itemTitle: string;

  @Column({ default: StatusEnum.PENDING })
  status: StatusEnum;

  @Exclude()
  @ManyToOne(() => ChecklistEntity, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
  })
  checklist: ChecklistEntity;
}
