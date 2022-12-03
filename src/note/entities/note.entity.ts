import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../shared/classes';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'notes' })
export class NoteEntity extends AbstractEntity {
  @ApiProperty({ example: 'buy book' })
  @Column({ length: 512 })
  description: string;

  @ApiProperty({ example: '#ff6347' })
  @Column({ length: 8 })
  color: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_completed: boolean;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.notes, { eager: true })
  owner: UserEntity;
}
