import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @ApiProperty({ example: '43ba4eb8-ee52-4adb-b2f8-df4a01b00d9a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}
