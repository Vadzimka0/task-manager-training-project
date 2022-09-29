import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { Data } from '../common/classes/response-data';
import { UserEntity } from '../user/entities/user.entity';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto, DeleteChecklistItemsDto, UpdateChecklistDto } from './dto';
import { ChecklistApiType } from './types';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get('user-checklists/:ownerId')
  async fetchAllUserChecklists(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ChecklistApiType[]>> {
    const data = await this.checklistService.fetchAllUserChecklists(userId, ownerId);
    return { data };
  }

  @Get('checklists/:listId')
  async fetchOneChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.fetchOneChecklist(userId, listId);
    return { data };
  }

  @Post('checklists')
  @HttpCode(200)
  async createChecklist(
    @Body() createChecklistDto: CreateChecklistDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.createChecklist(createChecklistDto, currentUser);
    return { data };
  }

  @Put('checklists/:listId')
  async updateChecklist(
    @Body() updateChecklistDto: UpdateChecklistDto,
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.updateChecklist(updateChecklistDto, userId, listId);
    return { data };
  }

  @Delete('checklists/:listId')
  async deleteChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.checklistService.deleteChecklist(userId, listId);
    return { data };
  }

  @Delete('checklists-items')
  async deleteChecklistItems(
    @User('id') userId: string,
    @Body() deleteChecklistItemsDto: DeleteChecklistItemsDto,
  ): Promise<Data<DeleteChecklistItemsDto>> {
    const data = await this.checklistService.deleteChecklistItems(
      userId,
      deleteChecklistItemsDto.items,
    );
    return { data };
  }

  @Delete('checklists-items/:itemId')
  async deleteChecklistItem(
    @User('id') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.checklistService.deleteChecklistItem(userId, itemId);
    return { data };
  }
}
