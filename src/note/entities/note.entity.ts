import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/classes';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'notes' })
export class NoteEntity extends AbstractEntity {
  @Column({ length: 512 })
  description: string;

  @Column({ length: 8 })
  color: string;

  @Column({ default: false })
  is_completed: boolean;

  @Exclude()
  @ManyToOne(() => UserEntity, (owner) => owner.notes, { eager: true })
  owner: UserEntity;
}
