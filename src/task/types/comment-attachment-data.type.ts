import { CommentAttachmentEntity } from '../entities';

export type CommentAttachmentData = Omit<
  CommentAttachmentEntity,
  'created_at' | 'comment' | 'setTypeToUpperCase'
>;
