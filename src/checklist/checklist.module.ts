import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistEntity, ChecklistItemEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistEntity, ChecklistItemEntity])],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
