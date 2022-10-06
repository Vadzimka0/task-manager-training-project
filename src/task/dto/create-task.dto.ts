import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { TaskAttachmentEntity } from '../entities/task-attachment.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Has to be no more than 256 characters',
    example: 'learn Spanish',
  })
  @IsNotEmpty()
  @MaxLength(256)
  readonly title: string;

  @ApiProperty({ example: 'practice with a tutor' })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: '2024-01-25T11:00:00' })
  @IsNotEmpty()
  @IsDateString()
  readonly due_date: Date;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  readonly is_completed: boolean;

  @ApiPropertyOptional({
    description: 'Has to match a user id OR null',
    example: '86fd5b28-eb9b-4c31-b19c-209a7ab050a4',
  })
  @IsOptional()
  // @IsNotEmpty()
  // @IsUUID()
  readonly assigned_to: string | null;

  @ApiProperty({
    description: 'Has to match a project id',
    example: 'b905021b-59e1-4c4a-a7e2-ee80fa4ef38e',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly project_id: string;

  @ApiProperty({
    description: 'Should be an owner ID of a USER that exists in the database',
    example: 'f60c913b-0859-4797-8dea-c07409ffcf0d',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly owner_id: string;

  @ApiProperty({
    description: 'Should be an array of users IDs that exists in the database OR nul',
    example: ['fb4cad39-9add-4633-8050-b933ad1d7458', 'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce'],
  })
  @IsOptional()
  // @IsNotEmpty()
  // @IsArray()
  readonly members: null | string[];

  @ApiProperty({
    description: 'Has to match null',
    example: null,
  })
  @IsEmpty()
  // @IsOptional()
  readonly attachments: null | TaskAttachmentEntity[];
}
