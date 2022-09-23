import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { TaskEntity } from './task.entity';

@Entity({ name: 'task_attachments' })
export class TaskAttachmentEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  type: string;

  @Exclude()
  @Column()
  mimetype: string;

  @Exclude()
  @Column()
  path: string;

  @Exclude()
  @Column()
  filename: string;

  @Exclude()
  @ManyToOne(() => TaskEntity, (task) => task.attachments, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @BeforeInsert()
  setTypeToUpperCase() {
    this.type = this.type.toUpperCase();
  }
}
