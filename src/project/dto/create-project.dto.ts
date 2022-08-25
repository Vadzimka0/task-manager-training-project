import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MaxLength(32)
  readonly title: string;

  @IsNotEmpty()
  readonly color: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;
}
