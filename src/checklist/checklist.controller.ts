import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UserEntity } from '../user/entities/user.entity';
import { ChecklistService } from './checklist.service';
import {
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistDto,
  UpdateChecklistItemDto,
} from './dto';
import {
  ListItemResponseInterface,
  ListItemsResponseInterface,
  ListResponseInterface,
  ListsResponseInterface,
} from './types';
import { ListItemType } from './types/listItem.type';

@Controller('checklists')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  async findAllAuthorsChecklists(@User('id') userId: number): Promise<ListsResponseInterface> {
    return this.checklistService.findAllAuthorsChecklists(userId);
  }

  @Get(':listId/items')
  async findChecklistItems(
    @User('id') userId: number,
    @Param('listId') listId: number,
  ): Promise<ListItemsResponseInterface> {
    return this.checklistService.findChecklistItems(userId, listId);
  }

  @Post()
  async createChecklist(
    @Body() createChecklistDto: CreateChecklistDto,
    @User() currentUser: UserEntity,
  ): Promise<ListResponseInterface> {
    const checklist = await this.checklistService.createChecklist(createChecklistDto, currentUser);
    return this.checklistService.buildChecklistResponse(checklist);
  }

  @Patch(':listId')
  async updateChecklist(
    @Body() updateChecklistDto: UpdateChecklistDto,
    @User('id') userId: number,
    @Param('listId') listId: number,
  ): Promise<ListResponseInterface> {
    const checklist = await this.checklistService.updateChecklist(
      updateChecklistDto,
      userId,
      listId,
    );
    return this.checklistService.buildChecklistResponse(checklist);
  }

  @Delete(':listId')
  async deleteChecklist(
    @User('id') userId: number,
    @Param('listId') listId: number,
  ): Promise<DeleteResult> {
    return this.checklistService.deleteChecklist(userId, listId);
  }

  @Post(':listId/items')
  async createChecklistItem(
    @Body() createChecklistItemDto: CreateChecklistItemDto,
    @User('id') userId: number,
    @Param('listId') listId: number,
  ): Promise<ListItemResponseInterface> {
    const checklistItem = await this.checklistService.createChecklistItem(
      createChecklistItemDto,
      userId,
      listId,
    );
    return await this.checklistService.buildChecklistItemResponse(checklistItem as ListItemType);
  }

  @Patch(':listId/items/:itemId')
  async updateChecklistItem(
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
    @User('id') userId: number,
    @Param('listId') listId: number,
    @Param('itemId') itemId: number,
  ): Promise<ListItemResponseInterface> {
    const checklistItem = await this.checklistService.updateChecklistItem(
      updateChecklistItemDto,
      userId,
      listId,
      itemId,
    );
    return await this.checklistService.buildChecklistItemResponse(checklistItem as ListItemType);
  }

  @Delete(':listId/items/:itemId')
  async deleteChecklistItem(
    @User('id') userId: number,
    @Param('listId') listId: number,
    @Param('itemId') itemId: number,
  ): Promise<DeleteResult> {
    return this.checklistService.deleteChecklistItem(userId, listId, itemId);
  }
}
