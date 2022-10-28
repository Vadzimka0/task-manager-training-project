import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { EntityId } from '../common/classes';
import { Data } from '../common/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { ChecklistMessageEnum, MessageEnum } from '../common/enums/messages.enum';
import { UserEntity } from '../user/entities/user.entity';
import { getApiParam } from '../utils';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto, DeleteChecklistItemsDto, UpdateChecklistDto } from './dto';
import { ChecklistApiDto } from './dto/api-dto/checklist-api.dto';

@ApiTags('Checklists:')
@Controller()
@UseGuards(JwtAuthGuard)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post('checklists')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Checklist' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}";`,
  })
  async createChecklist(
    @Body() createChecklistDto: CreateChecklistDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ChecklistApiDto>> {
    const checklist = await this.checklistService.createChecklist(createChecklistDto, currentUser);
    const data = this.checklistService.getRequiredFormatChecklist(checklist as ChecklistApiDto);
    return { data };
  }

  @Put('checklists/:listId')
  @ApiOperation({ summary: 'Update Checklist' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiForbiddenResponse({
    description: `Possible reasons: "${MessageEnum.INVALID_ID_NOT_OWNER}"; "${ChecklistMessageEnum.ITEM_NOT_BELONG_TO_CHECKLIST}";`,
  })
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}";`,
  })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('listId', 'checklist'))
  async updateChecklist(
    @Body() updateChecklistDto: UpdateChecklistDto,
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiDto>> {
    const checklist = await this.checklistService.updateChecklist(
      updateChecklistDto,
      userId,
      listId,
    );
    const data = this.checklistService.getRequiredFormatChecklist(checklist as ChecklistApiDto);
    return { data };
  }

  @Get('user-checklists/:ownerId')
  @ApiOperation({ summary: "Fetch User's Checklists" })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(ChecklistApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}";` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchUserChecklists(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ChecklistApiDto[]>> {
    const checklists = await this.checklistService.fetchUserChecklists(userId, ownerId);
    const data = checklists.map((checklist: ChecklistApiDto) => {
      checklist.items = this.checklistService.getRequiredFormatChecklistItems(checklist);
      return this.checklistService.getRequiredFormatChecklist(checklist as ChecklistApiDto);
    });
    return { data };
  }

  @Get('checklists/:listId')
  @ApiOperation({ summary: "Fetch One User's Checklist" })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ChecklistApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('listId', 'checklist'))
  async fetchChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<ChecklistApiDto>> {
    const checklist = await this.checklistService.fetchChecklist(userId, listId);
    checklist.items = this.checklistService.getRequiredFormatChecklistItems(checklist);
    const data = this.checklistService.getRequiredFormatChecklist(checklist as ChecklistApiDto);
    return { data };
  }

  @Delete('checklists/:listId')
  @ApiOperation({ summary: 'Delete Checklist' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(EntityId)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('listId', 'checklist'))
  async deleteChecklist(
    @User('id') userId: string,
    @Param('listId') listId: string,
  ): Promise<Data<EntityId>> {
    const data = await this.checklistService.deleteChecklist(userId, listId);
    return { data };
  }

  @Delete('checklists-items')
  @ApiOperation({ summary: 'Delete Checklist Items' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(DeleteChecklistItemsDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
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
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(EntityId)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('itemId', 'checklist item'))
  async deleteChecklistItem(
    @User('id') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<Data<EntityId>> {
    const data = await this.checklistService.deleteChecklistItem(userId, itemId);
    return { data };
  }
}
