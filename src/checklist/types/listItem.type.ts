import { ChecklistItemEntity } from '../entities/checklistItem.entity';

export type ListItemType = ChecklistItemEntity & {
  checklistId: number;
};
