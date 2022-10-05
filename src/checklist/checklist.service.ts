import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChecklistMessageEnum, MessageEnum } from '../common/enums/message.enum';
import { UserEntity } from '../user/entities/user.entity';
import {
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistDto,
  UpdateChecklistItemDto,
} from './dto';
import { ChecklistApiDto } from './dto/api-dto/checklist-api.dto';
import { ChecklistItemApiDto } from './dto/api-dto/checklist-item-api.dto';
import { ChecklistEntity } from './entities/checklist.entity';
import { ChecklistItemEntity } from './entities/checklistItem.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ChecklistItemEntity)
    private checklistItemRepository: Repository<ChecklistItemEntity>,
  ) {}

  async fetchAllUserChecklists(userId: string, ownerId: string): Promise<ChecklistApiDto[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.checklistRepository
      .createQueryBuilder('checklists')
      .leftJoinAndSelect('checklists.items', 'items')
      .leftJoinAndSelect('checklists.owner', 'owner')
      .andWhere('checklists.owner_id = :id', { id: userId })
      .orderBy('checklists.created_at', 'DESC');

    const checklists = await queryBuilder.getMany();

    return checklists.map((checklist: ChecklistApiDto) => {
      checklist.owner_id = userId;
      checklist.items = this.getItemsWithChecklistId(checklist);
      return checklist;
    });
  }

  async fetchOneChecklist(userId: string, listId: string): Promise<ChecklistApiDto> {
    const checklist = await this.findAndValidateChecklist(listId, userId);
    checklist.items = this.getItemsWithChecklistId(checklist);

    return this.getChecklistWithOwnerId(checklist as ChecklistApiDto);
  }

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    currentUser: UserEntity,
  ): Promise<ChecklistApiDto> {
    this.validateHexColor(createChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = createChecklistDto;
    this.idsMatching(owner_id, currentUser.id);

    const newChecklist = new ChecklistEntity();
    Object.assign(newChecklist, dtoWithoutItemsAndOwner);
    newChecklist.items = await this.getItemsInstances(items);
    newChecklist.owner = currentUser;
    const savedChecklist = await this.checklistRepository.save(newChecklist);
    savedChecklist.items = this.getItemsWithChecklistId(savedChecklist);

    return this.getChecklistWithOwnerId(savedChecklist as ChecklistApiDto);
  }

  async updateChecklist(
    updateChecklistDto: UpdateChecklistDto,
    userId: string,
    listId: string,
  ): Promise<ChecklistApiDto> {
    this.validateHexColor(updateChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = updateChecklistDto;
    this.idsMatching(owner_id, userId);

    const currentChecklist = await this.findAndValidateChecklist(listId, userId);
    Object.assign(currentChecklist, dtoWithoutItemsAndOwner);
    currentChecklist.items = await this.getUpdatedItems(items, listId);
    const savedChecklist = await this.checklistRepository.save(currentChecklist);
    savedChecklist.items = this.getItemsWithChecklistId(savedChecklist);

    return this.getChecklistWithOwnerId(savedChecklist as ChecklistApiDto);
  }

  async deleteChecklist(userId: string, listId: string): Promise<{ id: string }> {
    await this.findAndValidateChecklist(listId, userId);
    await this.checklistRepository.delete({ id: listId });

    return { id: listId };
  }

  async deleteChecklistItem(userId: string, itemId: string): Promise<{ id: string }> {
    await this.findAndValidateChecklistItem(itemId, userId);
    await this.checklistItemRepository.delete({ id: itemId });

    return { id: itemId };
  }

  async deleteChecklistItems(userId: string, itemsIds: string[]): Promise<{ items: string[] }> {
    const items = [];

    for (const itemId of itemsIds) {
      const currentItem = await this.findAndValidateChecklistItem(itemId, userId);
      await this.checklistItemRepository.delete({ id: itemId });
      items.push(currentItem.id);
    }

    return { items };
  }

  async getItemsInstances(items: CreateChecklistItemDto[] | null): Promise<ChecklistItemEntity[]> {
    if (!items) {
      return [];
    }

    const listItems = [];

    for (const item of items) {
      const newItem = new ChecklistItemEntity();
      Object.assign(newItem, item);
      await this.checklistItemRepository.save(newItem);
      listItems.push(newItem);
    }

    return listItems;
  }

  async getUpdatedItems(
    items: UpdateChecklistItemDto[] | null,
    listId: string,
  ): Promise<ChecklistItemEntity[]> {
    if (!items) {
      return [];
    }

    const currentItems = [];

    for (const item of items) {
      let currentItem: ChecklistItemEntity;
      const { id, ...itemWithoutId } = item;

      if (id) {
        currentItem = await this.findAndValidateChecklistItem(item.id, undefined, listId);
      } else {
        currentItem = new ChecklistItemEntity();
      }

      Object.assign(currentItem, itemWithoutId);
      await this.checklistItemRepository.save(currentItem);
      currentItems.push(currentItem);
    }

    return currentItems;
  }

  async findAndValidateChecklist(listId: string, userId: string): Promise<ChecklistEntity> {
    try {
      const checklist = await this.checklistRepository.findOneBy({ id: listId });

      if (!checklist) {
        throw new InternalServerErrorException(
          `Entity ChecklistModel, id=${listId} not found in the database`,
        );
      }

      if (checklist.owner.id !== userId) {
        throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
      }

      return checklist;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAndValidateChecklistItem(
    itemId: string,
    userId?: string,
    listId?: string,
  ): Promise<ChecklistItemEntity> {
    try {
      const checklistItem = await this.checklistItemRepository.findOne({
        where: { id: itemId },
        relations: ['checklist'],
      });

      if (!checklistItem) {
        throw new InternalServerErrorException(
          `Entity ChecklistItemModel, id=${itemId} not found in the database`,
        );
      }

      if (userId && checklistItem.checklist.owner.id !== userId) {
        throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
      }

      if (listId && checklistItem.checklist.id !== listId) {
        throw new ForbiddenException(ChecklistMessageEnum.ITEM_NOT_BELONG_TO_CHECKLIST);
      }

      return checklistItem;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_COLOR);
    }
  }

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    }
  }

  getChecklistWithOwnerId(checklist: ChecklistApiDto): ChecklistApiDto {
    checklist.owner_id = checklist.owner.id;

    return checklist;
  }

  getItemsWithChecklistId(checklist: ChecklistEntity): ChecklistItemApiDto[] {
    return checklist.items.map((item: ChecklistItemApiDto) => {
      item.checklist_id = checklist.id;

      return item;
    });
  }
}
