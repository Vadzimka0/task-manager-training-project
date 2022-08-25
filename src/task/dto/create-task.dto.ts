import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(256)
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  readonly due_date: Date;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  readonly assigned_to: string | null;

  @IsNotEmpty()
  @IsUUID()
  readonly project_id: string;

  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  readonly members: string[] | null;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  readonly attachments: string[] | null;
}
