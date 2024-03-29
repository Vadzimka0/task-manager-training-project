import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { TaskEntity } from './task.entity';

@Entity({ name: 'task_attachments' })
export class TaskAttachmentEntity {
  @ApiProperty({ example: '235781f7-1919-4441-b809-2ccc7618f943' })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty()
  // @CreateDateColumn()
  @Column()
  created_at: string;
  // created_at: Date;

  @ApiProperty({ enum: ['IMAGE', 'FILE'] })
  @Column()
  type: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  mimetype: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  path: string;

  @ApiProperty()
  @Column()
  name: string;
  // filename: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => TaskEntity, (task) => task.attachments, { onDelete: 'CASCADE' })
  task: TaskEntity;

  @BeforeInsert()
  setTypeToUpperCase() {
    this.type = this.type ? this.type.toUpperCase() : 'UNKNOWN';
  }

  @BeforeInsert()
  setCreatedAtDate() {
    this.created_at = new Date().toISOString().slice(0, 23);
  }
}
