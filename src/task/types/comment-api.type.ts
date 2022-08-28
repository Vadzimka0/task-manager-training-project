import { CommentEntity } from '../entities/comment.entity';

export type CommentApiType = CommentEntity & {
  owner_id: string;
  task_id: string;
};
