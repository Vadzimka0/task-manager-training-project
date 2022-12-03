import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../shared/classes';
import { ChecklistEntity } from './checklist.entity';

@Entity({ name: 'checklist_items' })
export class ChecklistItemEntity extends AbstractEntity {
  @ApiProperty({ example: 'visit car dealerships' })
  @Column({ length: 512 })
  content: string;

  @ApiProperty({ example: false })
  @Column()
  is_completed: boolean;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => ChecklistEntity, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  checklist: ChecklistEntity;
}
