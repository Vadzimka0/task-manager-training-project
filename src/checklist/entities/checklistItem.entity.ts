import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { ChecklistEntity } from './checklist.entity';

@Entity({ name: 'checklist_items' })
export class ChecklistItemEntity extends AbstractEntity {
  @Column({ length: 512 })
  content: string;

  @Column()
  is_completed: boolean;

  @Exclude()
  @ManyToOne(() => ChecklistEntity, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  checklist: ChecklistEntity;
}
