import { ChecklistItemEntity } from '../entities/checklistItem.entity';

export type ListItemApiType = ChecklistItemEntity & {
  checklist_id: string;
};
