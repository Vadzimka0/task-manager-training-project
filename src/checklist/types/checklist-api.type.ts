import { ChecklistEntity } from '../entities';

export type ChecklistApiType = ChecklistEntity & {
  owner_id: string;
};
