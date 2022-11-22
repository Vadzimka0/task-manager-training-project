import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../../common/constants/default-constants';
import { CommentMessageEnum, MessageEnum } from '../../common/enums/messages.enum';
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
  /**
   * @ignore
   */
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

  /**
   * A method that creates a task in the database
   * @param currentUser An user from JWT
   */
  async createTask(taskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskEntity> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;

    if (attachments !== null) throw new ForbiddenException('attachments must be null');

    this.idsMatching(owner_id, currentUser.id);

    const newTask = new TaskEntity();
    Object.assign(newTask, dtoWithoutRelationItems);

    const currentProject = await this.getProject(currentUser.id, project_id, assigned_to);
    newTask.project = currentProject;

    const assignedToUser = await this.getUserPerformer(assigned_to);
    newTask.performer = assignedToUser;

    const currentMembers = await this.getMembersById(members);
    newTask.members = currentMembers;

    return await this.taskRepository.save(newTask);
  }

  /**
   * A method that updates a task in the database
   * @param currentUser An user from JWT
   * @param taskId A taskId of a task. A task with this id should exist in the database
   */
  async updateTask(
    taskDto: CreateTaskDto,
    currentUser: UserEntity,
    taskId: string,
  ): Promise<TaskEntity> {
    const { owner_id, project_id, assigned_to, members, attachments, ...dtoWithoutRelationItems } =
      taskDto;

    if (attachments !== null) throw new ForbiddenException('attachments must be null');

    this.idsMatching(owner_id, currentUser.id);

    const currentTask = await this.getValidTaskForEdit(currentUser.id, taskId);
    Object.assign(currentTask, dtoWithoutRelationItems);

    const updatedProject = await this.getProject(currentUser.id, project_id, assigned_to);
    currentTask.project = updatedProject;

    const updatedPerformer = await this.getUserPerformer(assigned_to);
    currentTask.performer = updatedPerformer;

    const currentMembersIds = currentTask.members?.map((member) => member.id);

    if (!haveSameItems(members, currentMembersIds)) {
      const updatedMembers = await this.getMembersById(members);
      currentTask.members = updatedMembers;
    }

    return await this.taskRepository.save(currentTask);
  }

  /**
   * A method that deletes a task from the database. Files related to this task are also deleted from the storage.
   * @param userId An userId from JWT
   * @param taskId A taskId of a task. A task with this id should exist in the database
   * @returns A promise with the id of deleted task
   */
  async deleteTask(userId: string, taskId: string): Promise<{ id: string }> {
    await this.getValidTaskForEdit(userId, taskId);
    const taskAttachmentsPaths = await this.fetchTaskAttachmentsPaths(taskId);
    const tasksCommentsAttachmentsPaths = await this.fetchTaskCommentsAttachmentsPaths(taskId);

    await this.taskRepository.delete({ id: taskId });
    await removeFilesFromStorage([...taskAttachmentsPaths, ...tasksCommentsAttachmentsPaths]);

    return { id: taskId };
  }

  /**
   * A method that fetches tasks attachments from the database that belong to the task
   * @param taskId A taskId of a task. A task with this id should exist in the database
   * @returns A promise with the list of attachments paths
   */
  async fetchTaskAttachmentsPaths(taskId: string): Promise<string[]> {
    const taskAttachmentsPaths = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('tasks.id = :id', { id: taskId })
      .select('attachments.path')
      .getRawMany();

    return taskAttachmentsPaths.map((path) => path.attachments_path);
  }

  /**
   * A method that fetches comments attachments from the database that belong to the task
   * @param taskId A taskId of a task. A task with this id should exist in the database
   * @returns A promise with the list of attachments paths
   */
  async fetchTaskCommentsAttachmentsPaths(taskId: string): Promise<string[]> {
    const taskCommentsAttachmentsPaths = await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.comments', 'comments')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('tasks.id = :id', { id: taskId })
      .select('attachments.path')
      .getRawMany();

    return taskCommentsAttachmentsPaths.map((path) => path.attachments_path);
  }

  /**
   * A method that creates QueryBuilder for tasks
   */
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

  /**
   * A method that fetches project tasks of user
   * @param userId An userId from JWT
   * @param projectId A projectId of a project. A project with this id should exist in the database
   */
  async fetchProjectTasks(userId: string, projectId: string): Promise<TaskEntity[]> {
    await this.projectService.fetchProject(userId, projectId);
    const projectTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('project.id = :id', {
      id: projectId,
    });

    return await projectTasksQueryBuilder.getMany();
  }

  /**
   * A method that fetches tasks of owner
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchUserTasks(userId: string, ownerId: string): Promise<TaskEntity[]> {
    this.idsMatching(ownerId, userId);
    const userTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('project.owner_id = :id', {
      id: userId,
    });

    return await userTasksQueryBuilder.getMany();
  }

  /**
   * A method that fetches tasks of assigned to user
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchAssignedTasks(userId: string, ownerId: string): Promise<TaskEntity[]> {
    this.idsMatching(ownerId, userId);
    const assignedTasksQueryBuilder = this.getTasksQueryBuilder().andWhere('performer.id = :id', {
      id: ownerId,
    });

    return await assignedTasksQueryBuilder.getMany();
  }

  /**
   * A method that fetches tasks of member
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchParticipateInTasks(userId: string, ownerId: string): Promise<TaskEntity[]> {
    this.idsMatching(ownerId, userId);
    const participateInTasks = await this.taskRepository
      .createQueryBuilder()
      .relation(UserEntity, 'participate_tasks')
      .of(ownerId)
      .loadMany();

    return await this.getTasksWithAttachmentRelation(participateInTasks);
  }

  /**
   * A method that returns tasks with required relations: ['attachments.task']
   */
  async getTasksWithAttachmentRelation(tasks: TaskEntity[]): Promise<TaskEntity[]> {
    const extendedTasks = [];

    for (const task of tasks) {
      const extendedTask = await this.fetchTask(task.id);
      extendedTasks.push(extendedTask);
    }

    return extendedTasks;
  }

  /**
   * A method that returns required project
   * @param userId An userId from JWT or request body
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @param assignedToId An assignedToId of a user. An user with this id should exist in the database
   */
  async getProject(
    userId: string,
    projectId: string,
    assignedToId: string,
  ): Promise<ProjectEntity> {
    // if (!assignedToId) {
    //   const specialOneProject = await this.projectService.fetchProjectByTitle(
    //     SPECIAL_ONE_PROJECT_NAME,
    //     userId,
    //   );

    //   return specialOneProject;
    // }

    const project = await this.projectService.fetchProject(userId, projectId);

    return project;
  }

  /**
   * A method that returns the assigned user or null
   * @param assignedToId An assignedToId of a user. An user with this id should exist in the database
   */
  async getUserPerformer(assignedToId: string): Promise<UserEntity> {
    if (assignedToId) {
      return await this.userService.fetchUserById(assignedToId);
    }

    return null;
  }

  /**
   * A method that returns members
   * @param membersIds List of users identifiers. An user with this id should exist in the database
   */
  async getMembersById(membersIds: string[]): Promise<UserEntity[]> {
    if (membersIds) {
      return await this.userService.getMembersInstances(membersIds);
    }

    return null;
  }

  /**
   * A method that fetches a task from the database
   * @param taskId A taskId of a task. A task with this id should exist in the database
   */
  async fetchTask(taskId: string): Promise<TaskEntity> {
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

  /**
   * A method that checks if the task is available for editing
   * @param userId An userId from JWT
   * @param taskId A taskId of a task. A task with this id should exist in the database
   */
  async getValidTaskForEdit(userId: string, taskId: string): Promise<TaskEntity> {
    const task = await this.fetchTask(taskId);

    if (task.project.owner.id !== userId) {
      throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
    }

    return task;
  }

  /**
   * A method that checks if the task is available for commenting
   * @param userId An userId from JWT
   * @param taskId A taskId of a task. A task with this id should exist in the database
   */
  async getValidTaskForComment(userId: string, taskId: string): Promise<TaskEntity> {
    const task = await this.fetchTask(taskId);
    const ids = task.members.map((member) => member.id);

    if (!ids.includes(userId) && task.project.owner.id !== userId) {
      throw new ForbiddenException(CommentMessageEnum.INVALID_ID_NOT_OWNER_OR_MEMBER);
    }

    return task;
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
   * A method that adds properties: owner_id, project_id, assigned_to, members, attachments to Task according to the requirements
   */
  getRequiredFormatTask(task: TaskApiDto): TaskApiDto {
    task.owner_id = task.project.owner.id;
    task.project_id = task.project.id;
    task.assigned_to = task.performer ? task.performer.id : null;
    task.members = task.members?.length
      ? task.members.map((member: UserApiType) =>
          this.userAvatarService.getRequiredFormatUser(member),
        )
      : null;
    task.attachments = task.attachments?.length
      ? task.attachments.map((attachment: TaskAttachmentApiDto) =>
          this.taskAttachmentService.getRequiredFormatTaskAttachment(attachment),
        )
      : null;

    return task;
  }

  /**
   * A method that calculates the number of created and completed tasks by owner
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchTasksStatisticsByOwner(ownerId: string): Promise<TaskStatisticsApiType> {
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

  /**
   * A method that calculates a percentage of non completed tasks to total tasks by assigned to user
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchTodoStatisticsByPerformer(ownerId: string): Promise<string> {
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
