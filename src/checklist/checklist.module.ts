import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistEntity } from './entities/checklist.entity';
import { ChecklistItemEntity } from './entities/checklistItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistEntity, ChecklistItemEntity])],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
