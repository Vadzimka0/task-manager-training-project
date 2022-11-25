import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommentEntity } from './comment.entity';

@Entity({ name: 'comment_attachments' })
export class CommentAttachmentEntity {
  @ApiProperty({ example: '5cb5594e-b18d-45e9-bc32-4d97ef16f6af' })
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
  @ManyToOne(() => CommentEntity, (comment) => comment.attachments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @BeforeInsert()
  setTypeToUpperCase() {
    this.type = this.type ? this.type.toUpperCase() : 'UNKNOWN';
  }

  @BeforeInsert()
  setCreatedAtDate() {
    this.created_at = new Date().toISOString().slice(0, 23);
  }
}
