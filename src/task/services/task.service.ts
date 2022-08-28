import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../../common/constants/default-constants';
import { ProjectEntity } from '../../project/entities/project.entity';
import { ProjectService } from '../../project/project.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskApiType } from '../types/task-api.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async fetchOneTask(userId: string, taskId: string): Promise<TaskApiType> {
    const task = await this.getValidTask(userId, taskId);
    return this.getTaskWithRelationIds(task as TaskApiType, userId);
  }

  async fetchUserTasks(userId: string, ownerId: string): Promise<TaskApiType[]> {
    if (ownerId) this.idsMatching(ownerId, userId);

    const queryBuilder = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .leftJoinAndSelect('tasks.performer', 'performer')
      .leftJoinAndSelect('tasks.members', 'members')
      // .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('project.owner_id = :id', { id: userId })
      .orderBy('tasks.created_at', 'DESC');

    const tasks = await queryBuilder.getMany();
    const tasksWithRelationIds = tasks.map((task: TaskApiType) =>
      this.getTaskWithRelationIds(task, userId),
    );
    return tasksWithRelationIds;
  }

  async fetchProjectTasks(userId: string, projectId: string): Promise<TaskApiType[]> {
    // TODO: matching projectid and owner
    const queryBuilder = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .leftJoinAndSelect('tasks.performer', 'performer')
      .leftJoinAndSelect('tasks.members', 'members')
      // .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('project.id = :id', { id: projectId })
      .orderBy('tasks.created_at', 'DESC');

    const tasks = await queryBuilder.getMany();
    const tasksWithRelationIds = tasks.map((task: TaskApiType) =>
      this.getTaskWithRelationIds(task, userId),
    );
    return tasksWithRelationIds;
  }

  async createTask(taskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskApiType> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;
    // if (attachments === undefined) throw new ForbiddenException('attachments must be null');
    this.idsMatching(owner_id, currentUser.id);

    const newTask = new TaskEntity();
    Object.assign(newTask, dtoWithoutRelationItems);

    const currentProject = await this.getProject(currentUser.id, project_id, assigned_to);
    newTask.project = currentProject;

    const assignedToUser = await this.getPerformerUser(currentUser, assigned_to);
    newTask.performer = assignedToUser;

    const currentMembers = await this.getMembersById(members);
    newTask.members = currentMembers;
    // newTask.attachments = null;

    const savedTask = await this.taskRepository.save(newTask);
    return this.getTaskWithRelationIds(savedTask as TaskApiType, currentUser.id);
  }

  async updateTask(
    taskDto: CreateTaskDto,
    currentUser: UserEntity,
    taskId: string,
  ): Promise<TaskApiType> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;
    this.idsMatching(owner_id, currentUser.id);

    const currentTask = await this.getValidTask(currentUser.id, taskId);
    Object.assign(currentTask, dtoWithoutRelationItems);

    if (currentTask.project.id !== project_id) {
      const updatedProject = await this.getProject(currentUser.id, project_id, assigned_to);
      currentTask.project = updatedProject;
    }

    if (currentTask.performer.id !== assigned_to) {
      const updatedPerformer = await this.getPerformerUser(currentUser, assigned_to);
      currentTask.performer = updatedPerformer;
    }

    const currentMembersArray = currentTask.members.map((member) => member.id);
    if (!this.haveSameIds(members, currentMembersArray)) {
      const updatedMembers = await this.getMembersById(members);
      currentTask.members = updatedMembers;
    }

    // attachments
    const savedTask = await this.taskRepository.save(currentTask);
    return this.getTaskWithRelationIds(savedTask as TaskApiType, currentUser.id);
  }

  async deleteTask(userId: string, taskId: string): Promise<{ id: string }> {
    await this.getValidTask(userId, taskId);
    await this.taskRepository.delete({ id: taskId });
    return { id: taskId };
  }

  async getProject(userId: string, projectId: string, assignedTo: string): Promise<ProjectEntity> {
    if (!assignedTo) {
      const specialOneProject = await this.projectService.getProjectByTitle(
        SPECIAL_ONE_PROJECT_NAME,
        userId,
      );
      return specialOneProject;
    }
    const project = await this.projectService.getProjectByProjectId(projectId, userId);
    return project;
  }

  async getPerformerUser(ownerUser: UserEntity, assignedToId: string): Promise<UserEntity> {
    if (assignedToId) {
      const assignedToUser = await this.userService.getById(assignedToId);
      return assignedToUser;
    }
    return ownerUser;
  }

  async getMembersById(membersIds: string[]): Promise<UserEntity[]> {
    if (membersIds) {
      const currentMembers = await this.userService.getMembersInstances(membersIds);
      return currentMembers;
    }
    return [];
  }

  async getValidTask(userId: string, taskId: string): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task) {
        throw new NotFoundException(`Entity TaskModel, id=${taskId} not found in the database`);
      }
      if (task.project.owner.id !== userId) {
        throw new ForbiddenException('Invalid ID. You are not an owner');
      }
      return task;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getValidTaskForComment(userId: string, taskId: string): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });
      if (!task) {
        throw new NotFoundException(`Entity TaskModel, id=${taskId} not found in the database`);
      }
      const ids = task.members.map((member) => member.id);
      if (!ids.includes(userId) && task.project.owner.id !== userId) {
        throw new ForbiddenException('Invalid ID. You are not an owner or member');
      }
      return task;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  haveSameIds(arr1: string[], arr2: string[]): boolean {
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

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new ForbiddenException('Invalid id');
    }
  }

  getTaskWithRelationIds(task: TaskApiType, userId: string): TaskApiType {
    task.owner_id = userId;
    task.project_id = task.project.id;
    task.assigned_to = task.performer.id;
    // task.attachments = task.attachments.map( () => ());
    return task;
  }
}
