import { ChecklistEntity } from '../entities';

export type ChecklistType = ChecklistEntity & {
  owner_id: string;
};
