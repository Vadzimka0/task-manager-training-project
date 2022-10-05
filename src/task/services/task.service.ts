import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../../common/constants/default-constants';
import { CommentMessageEnum, MessageEnum } from '../../common/enums/message.enum';
import { ProjectEntity } from '../../project/entities/project.entity';
import { ProjectService } from '../../project/project.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserAvatarService } from '../../user/services';
import { UserService } from '../../user/services/user.service';
import { UserApiType } from '../../user/types';
import { haveSameItems, removeFilesFromStorage } from '../../utils';
import { CreateTaskDto } from '../dto';
import { TaskApiDto } from '../dto/api-dto/task-api.dto';
import { TaskAttachmentApiDto } from '../dto/api-dto/task-attachment-api.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskStatisticsApiType } from '../types/task-statistics-api.type';
import { TaskAttachmentService } from './task-attachment.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => UserAvatarService))
    private readonly userAvatarService: UserAvatarService,
    @Inject(forwardRef(() => TaskAttachmentService))
    private readonly taskAttachmentService: TaskAttachmentService,
  ) {}

  async createTask(taskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskApiDto> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;

    if (attachments === undefined) throw new ForbiddenException('attachments must be null');

    this.idsMatching(owner_id, currentUser.id);

    const newTask = new TaskEntity();
    Object.assign(newTask, dtoWithoutRelationItems);

    const currentProject = await this.getProject(currentUser.id, project_id, assigned_to);
    newTask.project = currentProject;

    const assignedToUser = await this.getPerformerUser(assigned_to);
    newTask.performer = assignedToUser;

    const currentMembers = await this.getMembersById(members);
    newTask.members = currentMembers;

    const savedTask = await this.taskRepository.save(newTask);

    return this.getTaskWithRelationIds(savedTask as TaskApiDto);
  }

  async updateTask(
    taskDto: CreateTaskDto,
    currentUser: UserEntity,
    taskId: string,
  ): Promise<TaskApiDto> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;
    this.idsMatching(owner_id, currentUser.id);

    const currentTask = await this.getValidTaskForEdit(currentUser.id, taskId);
    Object.assign(currentTask, dtoWithoutRelationItems);

    const updatedProject = await this.getProject(currentUser.id, project_id, assigned_to);
    currentTask.project = updatedProject;

    const updatedPerformer = await this.getPerformerUser(assigned_to);
    currentTask.performer = updatedPerformer;

    const currentMembersArray = currentTask.members.map((member) => member.id);

    if (!haveSameItems(members, currentMembersArray)) {
      const updatedMembers = await this.getMembersById(members);
      currentTask.members = updatedMembers;
    }

    const savedTask = await this.taskRepository.save(currentTask);

    return this.getTaskWithRelationIds(savedTask as TaskApiDto);
  }

  async deleteTask(userId: string, taskId: string): Promise<{ id: string }> {
    await this.getValidTaskForEdit(userId, taskId);
    const taskAttachmentsPaths = await this.getTaskAttachmentsPaths(taskId);
    const tasksCommentsAttachmentsPaths = await this.getTaskCommentsAttachmentsPaths(taskId);

    await this.taskRepository.delete({ id: taskId });
    await removeFilesFromStorage([...taskAttachmentsPaths, ...tasksCommentsAttachmentsPaths]);

    return { id: taskId };
  }

  async getTaskAttachmentsPaths(taskId: string): Promise<string[]> {
    const taskAttachmentsPaths = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('tasks.id = :id', { id: taskId })
      .select('attachments.path')
      .getRawMany();

    return taskAttachmentsPaths.map((path) => path.attachments_path);
  }

  async getTaskCommentsAttachmentsPaths(taskId: string): Promise<string[]> {
    const taskCommentsAttachmentsPaths = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.comments', 'comments')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('tasks.id = :id', { id: taskId })
      .select('attachments.path')
      .getRawMany();

    return taskCommentsAttachmentsPaths.map((path) => path.attachments_path);
  }

  async fetchOneTask(taskId: string): Promise<TaskApiDto> {
    const task = await this.getAnyTaskById(taskId);
    return this.getTaskWithRelationIds(task as TaskApiDto);
  }

  getTasksQueryBuilder(): SelectQueryBuilder<TaskEntity> {
    return this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('tasks.performer', 'performer')
      .leftJoinAndSelect('tasks.members', 'members')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .leftJoinAndSelect('attachments.task', 'task')
      .orderBy('tasks.created_at', 'ASC');
  }

  async fetchProjectTasks(userId: string, projectId: string): Promise<TaskApiDto[]> {
    await this.projectService.findProjectForRead(projectId, userId);
    const projectTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('project.id = :id', {
      id: projectId,
    });
    const tasks = await projectTasksQueryBuilder.getMany();

    return tasks.map((task: TaskApiDto) => this.getTaskWithRelationIds(task));
  }

  async fetchUserTasks(userId: string, ownerId: string): Promise<TaskApiDto[]> {
    this.idsMatching(ownerId, userId);
    const userTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('project.owner_id = :id', {
      id: userId,
    });
    const tasks = await userTasksQueryBuilder.getMany();

    return tasks.map((task: TaskApiDto) => this.getTaskWithRelationIds(task));
  }

  async fetchAssignedTasks(userId: string, ownerId: string): Promise<TaskApiDto[]> {
    this.idsMatching(ownerId, userId);
    const assignedTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('performer.id = :id', {
      id: ownerId,
    });
    const tasks = await assignedTasksQueryBuilder.getMany();

    return tasks.map((task: TaskApiDto) => this.getTaskWithRelationIds(task));
  }

  async fetchParticipateInTasks(userId: string, ownerId: string): Promise<TaskApiDto[]> {
    this.idsMatching(ownerId, userId);
    const participateInTasks = await this.taskRepository
      .createQueryBuilder()
      .relation(UserEntity, 'participate_tasks')
      .of(ownerId)
      .loadMany();

    const tasksWithAttachmentRelation = await this.getTasksWithAttachmentRelation(
      participateInTasks,
    );

    return tasksWithAttachmentRelation.map((task: TaskApiDto) => this.getTaskWithRelationIds(task));
  }

  async getTasksWithAttachmentRelation(tasks: TaskEntity[]): Promise<TaskEntity[]> {
    const extendedTasks = [];

    for (const task of tasks) {
      const extendedTask = await this.getAnyTaskById(task.id);
      extendedTasks.push(extendedTask);
    }

    return extendedTasks;
  }

  async getProject(userId: string, projectId: string, assignedTo: string): Promise<ProjectEntity> {
    if (!assignedTo) {
      const specialOneProject = await this.projectService.findProjectByTitle(
        SPECIAL_ONE_PROJECT_NAME,
        userId,
      );

      return specialOneProject;
    }

    const project = await this.projectService.findProjectForRead(projectId, userId);

    return project;
  }

  async getPerformerUser(assignedToId: string): Promise<UserEntity> {
    if (assignedToId) {
      return await this.userService.getById(assignedToId);
    }

    return null;
  }

  async getMembersById(membersIds: string[]): Promise<UserEntity[]> {
    if (membersIds) {
      return await this.userService.getMembersInstances(membersIds);
    }

    return null;
  }

  async getAnyTaskById(taskId: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['attachments.task'],
    });

    if (!task) {
      throw new InternalServerErrorException(
        `Entity TaskModel, id=${taskId} not found in the database`,
      );
    }

    return task;
  }

  async getValidTaskForEdit(userId: string, taskId: string): Promise<TaskEntity> {
    try {
      const task = await this.getAnyTaskById(taskId);

      if (task.project.owner.id !== userId) {
        throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
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
      const task = await this.getAnyTaskById(taskId);
      const ids = task.members.map((member) => member.id);

      if (!ids.includes(userId) && task.project.owner.id !== userId) {
        throw new ForbiddenException(CommentMessageEnum.INVALID_ID_NOT_OWNER_OR_MEMBER);
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
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    }
  }

  getTaskWithRelationIds(task: TaskApiDto): TaskApiDto {
    task.owner_id = task.project.owner.id;
    task.project_id = task.project.id;
    task.assigned_to = task.performer ? task.performer.id : null;
    task.members = task.members?.length
      ? task.members.map((member: UserApiType) =>
          this.userAvatarService.getUserWithAvatarUrl(member),
        )
      : null;
    task.attachments = task.attachments?.length
      ? task.attachments.map((attachment: TaskAttachmentApiDto) =>
          this.taskAttachmentService.getFullTaskAttachment(attachment),
        )
      : null;

    return task;
  }

  async getTasksStatisticsByOwner(ownerId: string): Promise<TaskStatisticsApiType> {
    const ownerTasksQueryBuilder = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.project', 'project')
      .andWhere('project.owner_id = :id', { id: ownerId })
      .select('COUNT(tasks)');

    const createdTasksObject = await ownerTasksQueryBuilder.getRawOne();
    const completedTasksObject = await ownerTasksQueryBuilder
      .andWhere('tasks.is_completed = :isCompleted', { isCompleted: true })
      .getRawOne();

    const created_tasks = +createdTasksObject.count;
    const completed_tasks = +completedTasksObject.count;

    return { created_tasks, completed_tasks };
  }

  async getTodoStatisticsByPerformer(ownerId: string): Promise<string> {
    const performerTasksQueryBuilder = this.taskRepository
      .createQueryBuilder('tasks')
      .andWhere('tasks.performer_id = :id', { id: ownerId })
      .select('COUNT(tasks)');

    const totalPerformerTasksObject = await performerTasksQueryBuilder.getRawOne();
    const completedPerformerTasksObject = await performerTasksQueryBuilder
      .andWhere('tasks.is_completed = :isCompleted', { isCompleted: true })
      .getRawOne();

    const total_performer_tasks = +totalPerformerTasksObject.count;
    const completed_performer_tasks = +completedPerformerTasksObject.count;
    const todo = total_performer_tasks
      ? `${((completed_performer_tasks / total_performer_tasks) * 100).toFixed(0)}%`
      : '0%';

    return todo;
  }
}
