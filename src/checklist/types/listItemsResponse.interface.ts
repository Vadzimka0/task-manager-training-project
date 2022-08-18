import { ListItemType } from './listItem.type';

export interface ListItemsResponseInterface {
  checklistItems: ListItemType[];
  checklistItemsCount: number;
}
