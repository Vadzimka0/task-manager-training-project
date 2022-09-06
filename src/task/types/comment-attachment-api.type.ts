import { CommentAttachmentEntity } from '../entities';

export type CommentAttachmentApiType = CommentAttachmentEntity & {
  comment_id: string;
  url: string;
};
