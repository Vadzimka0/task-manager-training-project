import { ChecklistEntity } from '../entities/checklist.entity';

export interface ListsResponseInterface {
  checklists: ChecklistEntity[];
  checklistsCount: number;
}
