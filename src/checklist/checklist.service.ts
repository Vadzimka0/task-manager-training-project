import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import {
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistDto,
  UpdateChecklistItemDto,
} from './dto';
import { ChecklistEntity, ChecklistItemEntity } from './entities';
import { ChecklistType, ListItemType } from './types';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ChecklistItemEntity)
    private checklistItemRepository: Repository<ChecklistItemEntity>,
  ) {}

  async fetchAllUserChecklists(userId: string, ownerId: string): Promise<ChecklistType[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.checklistRepository
      .createQueryBuilder('checklists')
      .leftJoinAndSelect('checklists.items', 'items')
      .leftJoinAndSelect('checklists.owner', 'owner')
      .andWhere('checklists.owner_id = :id', { id: userId })
      .orderBy('checklists.created_at', 'DESC');

    const checklists = await queryBuilder.getMany();
    const checklistsWithOwnerId = checklists.map((checklist: ChecklistType) => {
      checklist.owner_id = userId;
      checklist.items = this.getItemsWithChecklistId(checklist);
      return checklist;
    });
    return checklistsWithOwnerId;
  }

  async fetchOneChecklist(userId: string, listId: string): Promise<ChecklistType> {
    const checklist = await this.findAndValidateChecklist(listId, userId);
    checklist.items = this.getItemsWithChecklistId(checklist);
    return this.getChecklistWithOwnerId(checklist as ChecklistType, userId);
  }

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    currentUser: UserEntity,
  ): Promise<ChecklistType> {
    this.validateHexColor(createChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = createChecklistDto;
    this.idsMatching(owner_id, currentUser.id);

    const newChecklist = new ChecklistEntity();
    Object.assign(newChecklist, dtoWithoutItemsAndOwner);
    newChecklist.items = await this.getItemsInstances(items);
    newChecklist.owner = currentUser;

    const savedChecklist = await this.checklistRepository.save(newChecklist);
    savedChecklist.items = this.getItemsWithChecklistId(savedChecklist);
    return this.getChecklistWithOwnerId(savedChecklist as ChecklistType, currentUser.id);
  }

  async updateChecklist(
    updateChecklistDto: UpdateChecklistDto,
    userId: string,
    listId: string,
  ): Promise<ChecklistType> {
    this.validateHexColor(updateChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = updateChecklistDto;
    this.idsMatching(owner_id, userId);

    const currentChecklist = await this.findAndValidateChecklist(listId, userId);
    Object.assign(currentChecklist, dtoWithoutItemsAndOwner);

    if (
      (items === null && currentChecklist.items.length) ||
      (items && items.length && !currentChecklist.items.length)
    ) {
      throw new ForbiddenException('The count of items cannot be different from the original');
    }

    currentChecklist.items = await this.getUpdatedItems(items, listId);

    const savedChecklist = await this.checklistRepository.save(currentChecklist);
    savedChecklist.items = this.getItemsWithChecklistId(savedChecklist);
    return this.getChecklistWithOwnerId(savedChecklist as ChecklistType, userId);
  }

  async deleteChecklist(userId: string, listId: string): Promise<{ id: string }> {
    await this.findAndValidateChecklist(listId, userId);
    await this.checklistRepository.delete({ id: listId });
    return { id: listId };
  }

  async deleteChecklistItem(userId: string, itemId: string): Promise<{ id: string }> {
    await this.findAndValidateOwnersItem(userId, itemId);
    await this.checklistItemRepository.delete({ id: itemId });
    return { id: itemId };
  }

  async deleteChecklistItems(userId: string, itemsIds: string[]): Promise<{ items: string[] }> {
    const items = [];
    for (const itemId of itemsIds) {
      const currentItem = await this.findAndValidateOwnersItem(userId, itemId);
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
      const currentItem = await this.findAndValidateChecklistItem(listId, item.id);
      Object.assign(currentItem, item);
      await this.checklistItemRepository.save(currentItem);
      currentItems.push(currentItem);
    }
    return currentItems;
  }

  async findAndValidateChecklist(listId: string, userId: string): Promise<ChecklistEntity> {
    try {
      const checklist = await this.checklistRepository.findOneBy({ id: listId });
      if (checklist.owner.id !== userId) {
        throw new Error();
      }
      return checklist;
    } catch (_) {
      throw new InternalServerErrorException(
        `Entity ChecklistModel, id=${listId} not found in the database`,
      );
    }
  }

  async findAndValidateChecklistItem(listId: string, itemId: string): Promise<ChecklistItemEntity> {
    try {
      const checklistItem = await this.checklistItemRepository.findOne({
        where: { id: itemId },
        relations: ['checklist'],
      });
      if (checklistItem.checklist.id !== listId) {
        throw new Error();
      }
      return checklistItem;
    } catch (_) {
      throw new InternalServerErrorException(
        `Entity ChecklisItemtModel, id=${itemId} not found in the database`,
      );
    }
  }

  async findAndValidateOwnersItem(userId: string, itemId: string): Promise<ChecklistItemEntity> {
    try {
      const checklistItem = await this.checklistItemRepository.findOne({
        where: { id: itemId },
        relations: ['checklist'],
      });
      if (checklistItem.checklist.owner.id !== userId) {
        throw new Error();
      }
      return checklistItem;
    } catch (_) {
      throw new InternalServerErrorException(
        `Entity ChecklisItemtModel, id=${itemId} not found in the database`,
      );
    }
  }

  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(
        'Color is not valid. The length has to be 7 symbols and first one has to be #.',
      );
    }
  }

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new ForbiddenException('Invalid ID. You are not an owner');
    }
  }

  getChecklistWithOwnerId(checklist: ChecklistType, userId: string): ChecklistType {
    checklist.owner_id = userId;
    return checklist;
  }

  getItemsWithChecklistId(checklist: ChecklistEntity): ListItemType[] {
    return checklist.items.map((item: ListItemType) => {
      item.checklist_id = checklist.id;
      return item;
    });
  }
}
