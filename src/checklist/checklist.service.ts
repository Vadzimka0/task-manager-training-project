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
import {
  ListItemResponseInterface,
  ListItemType,
  ListResponseInterface,
  ChecklistType,
} from './types';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ChecklistItemEntity)
    private checklistItemRepository: Repository<ChecklistItemEntity>,
  ) {}

  // async findAllAuthorsChecklists(userId: string): Promise<ListsResponseInterface> {
  //   const queryBuilder = this.checklistRepository
  //     .createQueryBuilder('checklists')
  //     .leftJoinAndSelect('checklists.items', 'items')
  //     .leftJoinAndSelect('checklists.owner', 'author')
  //     .andWhere('checklists.ownerId = :id', { id: userId })
  //     .orderBy('checklists.created_at', 'DESC');

  //   const [checklists, checklistsCount] = await queryBuilder.getManyAndCount();
  //   return { checklists, checklistsCount };
  // }

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

    savedChecklist.items = savedChecklist.items.map((item: ListItemType) => {
      item.checklist_id = savedChecklist.id;
      return item;
    });
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

    savedChecklist.items = savedChecklist.items.map((item: ListItemType) => {
      item.checklist_id = savedChecklist.id;
      return item;
    });
    return this.getChecklistWithOwnerId(savedChecklist as ChecklistType, userId);
  }

  getChecklistWithOwnerId(checklist: ChecklistType, userId: string): ChecklistType {
    checklist.owner_id = userId;
    return checklist;
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

  // async deleteChecklist(userId: string, listId: string): Promise<DeleteResult> {
  //   await this.findAndValidateChecklist(listId, userId);
  //   return this.checklistRepository.delete({ id: listId });
  // }

  // async findChecklistItems(userId: string, listId: string): Promise<ListItemsResponseInterface> {
  //   await this.findAndValidateChecklist(listId, userId);
  //   const queryBuilder = this.checklistItemRepository
  //     .createQueryBuilder('items')
  //     .leftJoinAndSelect('items.checklist', 'checklist')
  //     .andWhere('items.checklistId = :id', { id: listId });

  //   const [checklistItems, checklistItemsCount] = await queryBuilder.getManyAndCount();
  //   const checklistItemsWithChecklistId = checklistItems.map((item: ListItemType) => {
  //     item.checklistId = item.checklist.id;
  //     return item;
  //   });
  //   return { checklistItems: checklistItemsWithChecklistId, checklistItemsCount };
  // }

  // async createChecklistItem(
  //   createChecklistItemDto: CreateChecklistItemDto,
  //   userId: string,
  //   listId: string,
  // ): Promise<ChecklistItemEntity> {
  //   const currentChecklist = await this.findAndValidateChecklist(listId, userId);
  //   const newChecklistItem = new ChecklistItemEntity();
  //   Object.assign(newChecklistItem, createChecklistItemDto);
  //   newChecklistItem.checklist = currentChecklist;
  //   return await this.checklistItemRepository.save(newChecklistItem);
  // }

  // async updateChecklistItem(
  //   updateChecklistItemDto: UpdateChecklistItemDto,
  //   userId: string,
  //   listId: string,
  //   itemId: string,
  // ): Promise<ChecklistItemEntity> {
  //   await this.findAndValidateChecklist(listId, userId);
  //   const currentChecklistItem = await this.findAndValidateChecklistItem(listId, itemId);
  //   Object.assign(currentChecklistItem, updateChecklistItemDto);
  //   return await this.checklistItemRepository.save(currentChecklistItem);
  // }

  // async deleteChecklistItem(userId: string, listId: string, itemId: string): Promise<DeleteResult> {
  //   await this.findAndValidateChecklist(listId, userId);
  //   await this.findAndValidateChecklistItem(listId, itemId);
  //   return this.checklistItemRepository.delete({ itemId });
  // }

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

  buildChecklistResponse(checklist: ChecklistEntity): ListResponseInterface {
    return { checklist };
  }

  // buildChecklistItemResponse(checklistItem: ListItemType): ListItemResponseInterface {
  //   checklistItem.checklistId = checklistItem.checklist.id;
  //   return { checklistItem };
  // }
}
