import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../shared/classes';
import { UserEntity } from '../../user/entities/user.entity';
import { ChecklistItemApiDto } from '../dto/api-dto/checklist-item-api.dto';
import { ChecklistItemEntity } from './checklistItem.entity';

@Entity({ name: 'checklists' })
export class ChecklistEntity extends AbstractEntity {
  @ApiProperty({ example: 'buy car' })
  @Column({ length: 512 })
  title: string;

  @ApiProperty({ example: '#00FFFF' })
  @Column({ length: 8 })
  color: string;

  @ApiProperty({ type: () => [ChecklistItemApiDto], nullable: true })
  @OneToMany(() => ChecklistItemEntity, (item: ChecklistItemEntity) => item.checklist, {
    eager: true,
  })
  items: ChecklistItemEntity[];

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.checklists, { eager: true })
  owner: UserEntity;
}
