import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../../common/constants/default-constants';
import { ProjectEntity } from '../../project/entities/project.entity';
import { ProjectService } from '../../project/project.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { haveSameItems } from '../../utils';
import { CreateTaskDto } from '../dto';
import { TaskEntity } from '../entities';
import { TaskApiType, TaskAttachmentApiType } from '../types';
import { TaskAttachmentService } from './task-attachment.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TaskAttachmentService))
    private readonly taskAttachmentService: TaskAttachmentService,
  ) {}

  async fetchOneTask(userId: string, taskId: string): Promise<TaskApiType> {
    const task = await this.getValidTask(userId, taskId);
    return this.getTaskWithRelationIds(task as TaskApiType, userId);
  }

  async fetchUserTasks(userId: string, ownerId: string): Promise<TaskApiType[]> {
    this.idsMatching(ownerId, userId);

    const queryBuilder = this.getTasksQueryBuilder()
      .andWhere('project.owner_id = :id', { id: userId })
      .orderBy('tasks.created_at', 'DESC');

    const tasks = await queryBuilder.getMany();
    const tasksWithRelationIds = tasks.map((task: TaskApiType) =>
      this.getTaskWithRelationIds(task, userId),
    );
    return tasksWithRelationIds;
  }

  async fetchProjectTasks(userId: string, projectId: string): Promise<TaskApiType[]> {
    await this.projectService.findProjectForRead(projectId, userId);

    const queryBuilder = this.getTasksQueryBuilder()
      .andWhere('project.id = :id', { id: projectId })
      .orderBy('tasks.created_at', 'DESC');

    const tasks = await queryBuilder.getMany();
    const tasksWithRelationIds = tasks.map((task: TaskApiType) =>
      this.getTaskWithRelationIds(task, userId),
    );
    return tasksWithRelationIds;
  }

  getTasksQueryBuilder(): SelectQueryBuilder<TaskEntity> {
    return this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .leftJoinAndSelect('tasks.performer', 'performer')
      .leftJoinAndSelect('tasks.members', 'members')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .leftJoinAndSelect('attachments.task', 'task');
  }

  async createTask(taskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskApiType> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;
    if (attachments === undefined) throw new ForbiddenException('attachments must be null');
    this.idsMatching(owner_id, currentUser.id);

    const newTask = new TaskEntity();
    Object.assign(newTask, dtoWithoutRelationItems);

    const currentProject = await this.getProject(currentUser.id, project_id, assigned_to);
    newTask.project = currentProject;

    const assignedToUser = await this.getPerformerUser(currentUser, assigned_to);
    newTask.performer = assignedToUser;

    const currentMembers = await this.getMembersById(members);
    newTask.members = currentMembers;
    newTask.attachments = null;

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
    if (!haveSameItems(members, currentMembersArray)) {
      const updatedMembers = await this.getMembersById(members);
      currentTask.members = updatedMembers;
    }

    // attachments ???
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
      const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['attachments'],
      });
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

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new ForbiddenException('Invalid id');
    }
  }

  getTaskWithRelationIds(task: TaskApiType, userId: string): TaskApiType {
    task.owner_id = userId;
    task.project_id = task.project.id;
    task.assigned_to = task.performer.id;
    task.attachments = task.attachments
      ? task.attachments?.map((attachment: TaskAttachmentApiType) =>
          this.taskAttachmentService.getAttachmentWithTaskId(attachment),
        )
      : null;
    return task;
  }
}
