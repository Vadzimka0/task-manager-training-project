import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteChecklistItemsDto {
  @IsNotEmpty()
  @IsArray()
  readonly items: string[];
}
