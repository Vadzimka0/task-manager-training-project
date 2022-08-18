import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract-entity-class';
import { ColorEnum, StatusEnum } from '../../common/enums';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'notes' })
export class NoteEntity extends AbstractEntity {
  @Column({ length: 512 })
  description: string;

  @Column()
  color: ColorEnum;

  @Column({ default: StatusEnum.PENDING })
  status: StatusEnum;

  @ManyToOne(() => UserEntity, (author) => author.notes, { eager: true })
  author: UserEntity;
}
