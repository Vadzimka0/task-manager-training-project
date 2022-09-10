import { IsUUID } from 'class-validator';

export class FetchUserNotesDto {
  @IsUUID()
  readonly owner_id: string;
}
