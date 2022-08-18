import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChecklistItemDto {
  @IsNotEmpty()
  @MaxLength(512)
  readonly itemTitle: string;
}
