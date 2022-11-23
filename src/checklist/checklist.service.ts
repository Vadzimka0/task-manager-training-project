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

import { ChecklistMessageEnum, MessageEnum } from '../common/enums/messages.enum';
import { UserEntity } from '../user/entities/user.entity';
import {
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistDto,
  UpdateChecklistItemDto,
} from './dto';
import { ChecklistApiDto, ChecklistItemApiDto } from './dto/api-dto';
import { ChecklistEntity } from './entities/checklist.entity';
import { ChecklistItemEntity } from './entities/checklistItem.entity';

@Injectable()
export class ChecklistService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(ChecklistEntity)
    private checklistRepository: Repository<ChecklistEntity>,
    @InjectRepository(ChecklistItemEntity)
    private checklistItemRepository: Repository<ChecklistItemEntity>,
  ) {}

  /**
   * A method that fetches user checklists from the database
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchUserChecklists(userId: string, ownerId: string): Promise<ChecklistEntity[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.checklistRepository
      .createQueryBuilder('checklists')
      .leftJoinAndSelect('checklists.items', 'items')
      .leftJoinAndSelect('checklists.owner', 'owner')
      .andWhere('checklists.owner_id = :id', { id: userId })
      .orderBy('checklists.created_at', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * A method that creates a checklist in the database
   * @param currentUser An user from JWT
   */
  async createChecklist(
    createChecklistDto: CreateChecklistDto,
    currentUser: UserEntity,
  ): Promise<ChecklistEntity> {
    this.validateHexColor(createChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = createChecklistDto;
    this.idsMatching(owner_id, currentUser.id);

    const newChecklist = new ChecklistEntity();
    Object.assign(newChecklist, dtoWithoutItemsAndOwner);
    newChecklist.items = await this.createChecklistItems(items);
    newChecklist.owner = currentUser;

    return await this.checklistRepository.save(newChecklist);
  }

  /**
   * A method that updates a checklist in the database
   * @param userId An userId from JWT
   * @param listId A listId of a checklist. A checklist with this id should exist in the database
   */
  async updateChecklist(
    updateChecklistDto: UpdateChecklistDto,
    userId: string,
    listId: string,
  ): Promise<ChecklistEntity> {
    this.validateHexColor(updateChecklistDto.color);
    const { items, owner_id, ...dtoWithoutItemsAndOwner } = updateChecklistDto;
    this.idsMatching(owner_id, userId);

    const currentChecklist = await this.fetchChecklist(userId, listId);
    Object.assign(currentChecklist, dtoWithoutItemsAndOwner);
    currentChecklist.items = await this.updateChecklistItems(items, listId);

    return await this.checklistRepository.save(currentChecklist);
  }

  /**
   * A method that deletes a checklist from the database
   * @param userId An userId from JWT
   * @param listId A listId of a checklist. A checklist with this id should exist in the database
   * @returns A promise with the id of deleted checklist
   */
  async deleteChecklist(userId: string, listId: string): Promise<{ id: string }> {
    await this.fetchChecklist(userId, listId);
    await this.checklistRepository.delete({ id: listId });

    return { id: listId };
  }

  /**
   * A method that deletes a checklist item from the database
   * @param userId An userId from JWT
   * @param itemId An itemId of a checklist item. A checklist item with this id should exist in the database
   * @returns A promise with the id of deleted checklist item
   */
  async deleteChecklistItem(userId: string, itemId: string): Promise<{ id: string }> {
    await this.fetchChecklistItem(itemId, userId);
    await this.checklistItemRepository.delete({ id: itemId });

    return { id: itemId };
  }

  /**
   * A method that deletes checklist items from the database
   * @param userId An userId from JWT
   * @param itemsIds List of checklist items identifiers. A checklist items with this id should exist in the database
   * @returns A promise with the list of deleted checklist items identifiers
   */
  async deleteChecklistItems(userId: string, itemsIds: string[]): Promise<{ items: string[] }> {
    const items = [];

    for (const itemId of itemsIds) {
      const currentItem = await this.fetchChecklistItem(itemId, userId);
      await this.checklistItemRepository.delete({ id: itemId });
      items.push(currentItem.id);
    }

    return { items };
  }

  /**
   * A method that creates checklist items in the database
   * @returns A promise with the list of created checklist items entities
   */
  async createChecklistItems(
    items: CreateChecklistItemDto[] | null,
  ): Promise<ChecklistItemEntity[]> {
    if (!items) {
      return [];
    }

    const listItems = [];

    for (const item of items) {
      const newItem = new ChecklistItemEntity();
      const { id, ...itemWithoutId } = item;
      Object.assign(newItem, itemWithoutId);
      await this.checklistItemRepository.save(newItem);
      listItems.push(newItem);
    }

    return listItems;
  }

  /**
   * A method that updates checklist items in the database. If item does not exists in the database, it creates a new item in the database
   * @param listId A listId of a checklist. A checklist with this id should exist in the database
   * @returns A promise with the list of updated checklist items entities
   */
  async updateChecklistItems(
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
        currentItem = await this.fetchChecklistItem(item.id, undefined, listId);
      } else {
        currentItem = new ChecklistItemEntity();
      }

      Object.assign(currentItem, itemWithoutId);
      await this.checklistItemRepository.save(currentItem);
      currentItems.push(currentItem);
    }

    return currentItems;
  }

  /**
   * A method that fetches validated checklist from the database
   * @param listId A listId of a checklist. A checklist with this id should exist in the database
   * @param userId An userId from JWT
   */
  async fetchChecklist(userId: string, listId: string): Promise<ChecklistEntity> {
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
  }

  /**
   * A method that fetches validated checklist item from the database
   * @param itemId An itemId of a checklist item. A checklist item with this id should exist in the database
   * @param userId An userId from JWT
   * @param listId A listId of a checklist. A checklist with this id should exist in the database
   */
  async fetchChecklistItem(
    itemId: string,
    userId?: string,
    listId?: string,
  ): Promise<ChecklistItemEntity> {
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
  }

  /**
   * A method that validates color
   */
  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_COLOR);
    }
  }

  /**
   * A method that compares user identifiers from JWT and request body
   * @param owner_id An owner_id from request body
   * @param user_id An user_id from JWT
   */
  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    }
  }

  /**
   * A method that adds the owner_id property to Checklist according to the requirements
   */
  getRequiredFormatChecklist(checklist: ChecklistApiDto): ChecklistApiDto {
    checklist.owner_id = checklist.owner.id;

    return checklist;
  }

  /**
   * A method that adds the checklist_id property to each ChecklistItem of checklist according to the requirements
   */
  getRequiredFormatChecklistItems(checklist: ChecklistEntity): ChecklistItemApiDto[] {
    return checklist.items.map((item: ChecklistItemApiDto) => {
      item.checklist_id = checklist.id;

      return item;
    });
  }
}
