import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

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
  ListItemsResponseInterface,
  ListItemType,
  ListResponseInterface,
  ListsResponseInterface,
} from './types';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ChecklistItemEntity)
    private checklistItemRepository: Repository<ChecklistItemEntity>,
  ) {}

  async findAllAuthorsChecklists(userId: number): Promise<ListsResponseInterface> {
    const queryBuilder = this.checklistRepository
      .createQueryBuilder('checklists')
      .leftJoinAndSelect('checklists.items', 'items')
      .leftJoinAndSelect('checklists.author', 'author')
      .andWhere('checklists.authorId = :id', { id: userId })
      .orderBy('checklists.createdAt', 'DESC');

    const [checklists, checklistsCount] = await queryBuilder.getManyAndCount();
    return { checklists, checklistsCount };
  }

  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    currentUser: UserEntity,
  ): Promise<ChecklistEntity> {
    const newChecklist = new ChecklistEntity();
    if (createChecklistDto.itemsTitles) {
      const { itemsTitles, ...dtoWithoutItems } = createChecklistDto;
      Object.assign(newChecklist, dtoWithoutItems);
      const listItems = [];
      for (const text of itemsTitles) {
        if (text.length > 512) {
          throw new HttpException(
            'itemTitle must be shorter than or equal to 512 characters',
            HttpStatus.BAD_REQUEST,
          );
        }
        const newItem = new ChecklistItemEntity();
        Object.assign(newItem, { itemTitle: text });
        await this.checklistItemRepository.save(newItem);
        listItems.push(newItem);
      }
      newChecklist.items = listItems;
    } else {
      Object.assign(newChecklist, createChecklistDto);
      newChecklist.items = [];
    }
    newChecklist.author = currentUser;
    return await this.checklistRepository.save(newChecklist);
  }

  async updateChecklist(
    updateChecklistDto: UpdateChecklistDto,
    userId: number,
    listId: number,
  ): Promise<ChecklistEntity> {
    const currentChecklist = await this.findAndValidateChecklist(listId, userId);
    Object.assign(currentChecklist, updateChecklistDto);
    return await this.checklistRepository.save(currentChecklist);
  }

  async deleteChecklist(userId: number, listId: number): Promise<DeleteResult> {
    await this.findAndValidateChecklist(listId, userId);
    return this.checklistRepository.delete({ id: listId });
  }

  async findChecklistItems(userId: number, listId: number): Promise<ListItemsResponseInterface> {
    await this.findAndValidateChecklist(listId, userId);
    const queryBuilder = this.checklistItemRepository
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.checklist', 'checklist')
      .andWhere('items.checklistId = :id', { id: listId });

    const [checklistItems, checklistItemsCount] = await queryBuilder.getManyAndCount();
    const checklistItemsWithChecklistId = checklistItems.map((item: ListItemType) => {
      item.checklistId = item.checklist.id;
      return item;
    });
    return { checklistItems: checklistItemsWithChecklistId, checklistItemsCount };
  }

  async createChecklistItem(
    createChecklistItemDto: CreateChecklistItemDto,
    userId: number,
    listId: number,
  ): Promise<ChecklistItemEntity> {
    const currentChecklist = await this.findAndValidateChecklist(listId, userId);
    const newChecklistItem = new ChecklistItemEntity();
    Object.assign(newChecklistItem, createChecklistItemDto);
    newChecklistItem.checklist = currentChecklist;
    return await this.checklistItemRepository.save(newChecklistItem);
  }

  async updateChecklistItem(
    updateChecklistItemDto: UpdateChecklistItemDto,
    userId: number,
    listId: number,
    itemId: number,
  ): Promise<ChecklistItemEntity> {
    await this.findAndValidateChecklist(listId, userId);
    const currentChecklistItem = await this.findAndValidateChecklistItem(listId, itemId);
    Object.assign(currentChecklistItem, updateChecklistItemDto);
    return await this.checklistItemRepository.save(currentChecklistItem);
  }

  async deleteChecklistItem(userId: number, listId: number, itemId: number): Promise<DeleteResult> {
    await this.findAndValidateChecklist(listId, userId);
    await this.findAndValidateChecklistItem(listId, itemId);
    return this.checklistItemRepository.delete({ itemId });
  }

  async findAndValidateChecklist(listId: number, userId: number): Promise<ChecklistEntity> {
    const checklist = await this.checklistRepository.findOneBy({ id: listId });
    if (!checklist) {
      throw new HttpException('Checklist does not exist', HttpStatus.NOT_FOUND);
    }
    if (checklist.author.id !== userId) {
      throw new HttpException('You are not an author of this checklist', HttpStatus.FORBIDDEN);
    }
    return checklist;
  }

  async findAndValidateChecklistItem(listId: number, itemId: number): Promise<ChecklistItemEntity> {
    const checklistItem = await this.checklistItemRepository.findOne({
      where: { itemId },
      relations: ['checklist'],
    });
    if (!checklistItem) {
      throw new HttpException("Checklist's item does not exist", HttpStatus.NOT_FOUND);
    }
    if (checklistItem.checklist.id !== listId) {
      throw new HttpException('This item does not belong to this Checklist', HttpStatus.FORBIDDEN);
    }
    return checklistItem;
  }

  buildChecklistResponse(checklist: ChecklistEntity): ListResponseInterface {
    return { checklist };
  }

  buildChecklistItemResponse(checklistItem: ListItemType): ListItemResponseInterface {
    checklistItem.checklistId = checklistItem.checklist.id;
    return { checklistItem };
  }
}
