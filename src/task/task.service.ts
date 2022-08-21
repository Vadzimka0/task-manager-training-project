import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SPECIAL_ONE_PROJECT_NAME } from '../common/constants/default-constants';
import { ProjectEntity } from '../project/entities/project.entity';

import { ProjectService } from '../project/project.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}
  // async findAllAuthorsTasks(userId: number): Promise<any> {
  //   const queryBuilder = this.taskRepository
  //     .createQueryBuilder('tasks')
  //     .andWhere('tasks.authorId = :id', { id: userId })
  //     .orderBy('tasks.createdAt', 'DESC');
  //   const [tasks, tasksCount] = await queryBuilder.getManyAndCount();
  //   return { tasks, tasksCount };
  // }

  async createTask(createTaskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskEntity> {
    const newTask = new TaskEntity();

    const { assignedTo, members, tag, ...dtoWithoutRelationItems } = createTaskDto;
    Object.assign(newTask, dtoWithoutRelationItems);

    const currentTag = await this.getTag(currentUser.id, tag.title, assignedTo);
    newTask.tag = currentTag;

    const currentPerformer = await this.getPerformerByName(currentUser, assignedTo);
    newTask.performer = currentPerformer;

    const currentMembers = await this.getMembersByNames(members);
    newTask.members = currentMembers;

    return await this.taskRepository.save(newTask);
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    currentUser: UserEntity,
    taskId: number,
  ): Promise<TaskEntity> {
    const currentTask = await this.findAndValidateTask(currentUser.id, taskId);

    const { assignedTo, members, tag, ...dtoWithoutRelationItems } = updateTaskDto;
    Object.assign(currentTask, dtoWithoutRelationItems);

    if (currentTask.tag.title !== tag.title) {
      const updatedTag = await this.getTag(currentUser.id, tag.title, assignedTo);
      currentTask.tag = updatedTag;
    }

    if (currentTask.performer.username !== assignedTo) {
      const updatedPerformer = await this.getPerformerByName(currentUser, assignedTo);
      currentTask.performer = updatedPerformer;
    }

    const currentMembersArray = currentTask.members.map((member) => member.username);
    if (!this.haveSameNames(members, currentMembersArray)) {
      const updatedMembers = await this.getMembersByNames(members);
      currentTask.members = updatedMembers;
    }

    return await this.taskRepository.save(currentTask);
  }

  async deleteTask(userId: number, taskId: number): Promise<DeleteResult> {
    await this.findAndValidateTask(userId, taskId);
    return await this.taskRepository.delete({ id: taskId });
  }

  async getTag(userId: number, title: string, assignedTo: string): Promise<ProjectEntity> {
    if (!assignedTo) {
      const specialOneTag = await this.projectService.getTagByTitleAndUserId(
        SPECIAL_ONE_PROJECT_NAME,
        userId,
      );
      return specialOneTag;
    }
    const currentTag = await this.projectService.getTagByTitleAndUserId(title, userId);
    return currentTag;
  }

  async getPerformerByName(
    ownerUser: UserEntity,
    performerName: string | null,
  ): Promise<UserEntity> {
    if (performerName) {
      const currentPerformer = await this.userService.getByName(performerName);
      return currentPerformer;
    }
    return ownerUser;
  }

  async getMembersByNames(members: string[]): Promise<UserEntity[]> {
    if (members) {
      const currentMembers = await this.userService.getMembersInstances(members);
      return currentMembers;
    }
    return [];
  }

  async findAndValidateTask(userId: number, taskId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!task) {
      throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND);
    }
    if (task.tag.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return task;
  }

  haveSameNames(arr1: string[], arr2: string[]): boolean {
    if (!arr1) arr1 = [];
    if (arr1.length !== arr2.length) return false;
    const uniqueValues = new Set([...arr1, ...arr2]);
    for (const value of uniqueValues) {
      const arr1Count = arr1.filter((e) => e === value).length;
      const arr2Count = arr2.filter((e) => e === value).length;
      if (arr1Count !== arr2Count) return false;
    }
    return true;
  }
}
