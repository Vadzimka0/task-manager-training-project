import { ChecklistItemEntity } from '../entities/checklistItem.entity';

export type ListItemType = ChecklistItemEntity & {
  checklist_id: string;
};
