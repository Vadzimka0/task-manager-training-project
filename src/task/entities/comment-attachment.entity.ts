import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommentEntity } from './comment.entity';

@Entity({ name: 'comment_attachments' })
export class CommentAttachmentEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  url: string;

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
  @ManyToOne(() => CommentEntity, (comment) => comment.attachments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @BeforeInsert()
  setTypeToUpperCase() {
    this.type = this.type.toUpperCase();
  }
}
