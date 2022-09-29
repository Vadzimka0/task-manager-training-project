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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { EntityId } from '../common/classes';
import { Data } from '../common/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { UserEntity } from '../user/entities/user.entity';
import { getApiParam } from '../utils';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto, DeleteChecklistItemsDto, UpdateChecklistDto } from './dto';
import { ChecklistApiDto } from './dto/checklist-api.dto';
import { ChecklistApiType } from './types';

@ApiTags('Checklists:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post('checklists')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Checklist' })
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiBearerAuth('access-token')
  async createChecklist(
    @Body() createChecklistDto: CreateChecklistDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.createChecklist(createChecklistDto, currentUser);
    return { data };
  }

  @Put('checklists/:listId')
  @ApiOperation({ summary: 'Update Checklist' })
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('listId', 'checklist'))
  async updateChecklist(
    @Body() updateChecklistDto: UpdateChecklistDto,
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.updateChecklist(updateChecklistDto, userId, listId);
    return { data };
  }

  @Get('user-checklists/:ownerId')
  @ApiOperation({ summary: "Fetch User's Checklists" })
  @ApiOkArrayResponse(ChecklistApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchAllUserChecklists(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ChecklistApiType[]>> {
    const data = await this.checklistService.fetchAllUserChecklists(userId, ownerId);
    return { data };
  }

  @Get('checklists/:listId')
  @ApiOperation({ summary: "Fetch One User's Checklist" })
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('listId', 'checklist'))
  async fetchOneChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiType>> {
    const data = await this.checklistService.fetchOneChecklist(userId, listId);
    return { data };
  }

  @Delete('checklists/:listId')
  @ApiOperation({ summary: 'Delete Checklist' })
  @ApiOkObjectResponse(EntityId)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('listId', 'checklist'))
  async deleteChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.checklistService.deleteChecklist(userId, listId);
    return { data };
  }

  @Delete('checklists-items')
  @ApiOperation({ summary: 'Delete Checklist Items' })
  @ApiOkObjectResponse(DeleteChecklistItemsDto)
  @ApiBearerAuth('access-token')
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
  @ApiOperation({ summary: 'Delete Checklist Item' })
  @ApiOkObjectResponse(EntityId)
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('itemId', 'checklist item'))
  async deleteChecklistItem(
    @User('id') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.checklistService.deleteChecklistItem(userId, itemId);
    return { data };
  }
}
