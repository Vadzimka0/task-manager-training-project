import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsUUID,
  MaxLength,
  ValidateIf,
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

  @IsEmpty()
  readonly attachments: null;
}
