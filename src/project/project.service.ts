import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../common/constants/default-constants';
import { MessageEnum, ProjectMessageEnum } from '../common/enums/messages.enum';
import { UtilsService } from '../common/services/utils.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto, ProjectApiDto, ProjectStatisticApiDto } from './dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private readonly utilsService: UtilsService,
  ) {}

  /**
   * A method that fetches user projects from the database
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   * @param search An object with property of query string of a URL
   */
  async fetchUserProjects(
    userId: string,
    ownerId?: string,
    search?: { query: string },
  ): Promise<ProjectEntity[]> {
    if (ownerId) this.idsMatching(ownerId, userId);

    const queryBuilder = this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .andWhere('projects.owner_id = :id', { id: userId })
      .orderBy('projects.created_at', 'ASC');

    if (search && search.query) {
      queryBuilder.andWhere('projects.title LIKE :query', {
        query: `%${search.query}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  /**
   * A method that calculates the number of tasks for each project by user
   * @param userId An userId from JWT
   * @param ownerId An ownerId from URI Parameters
   */
  async fetchProjectStatistics(userId: string, ownerId: string): Promise<ProjectStatisticApiDto[]> {
    this.idsMatching(userId, ownerId);

    const tasksNumbers = await this.projectRepository
      // .createQueryBuilder('project')
      // .leftJoinAndSelect('project.owner', 'owner')
      // .leftJoinAndSelect('project.tasks', 'tasks')
      // .andWhere('project.owner_id = :id', { id: userId })
      // .select('project.id')
      // .loadRelationCountAndMap('project.tasks_number', 'project.tasks')
      // .getMany();
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .andWhere('project.owner_id = :id', { id: userId })
      .select('project.id')
      .addSelect('COUNT(tasks.id)', 'tasks_number')
      .groupBy('project.id')
      .getRawMany();

    return tasksNumbers.map((projectInfo: ProjectStatisticApiDto) => ({
      ...projectInfo,
      tasks_number: Number(projectInfo.tasks_number),
    }));
  }

  /**
   * A method that creates a project in the database
   * @param currentUser An user from JWT
   */
  async createProject(
    projectDto: CreateProjectDto,
    currentUser: UserEntity,
  ): Promise<ProjectEntity> {
    this.validateHexColor(projectDto.color);
    const { owner_id, ...dtoWithoutOwner } = projectDto;
    this.idsMatching(owner_id, currentUser.id);
    await this.checkDuplicateProjectTitle(projectDto.title, currentUser.id);

    const newProject = new ProjectEntity();
    Object.assign(newProject, dtoWithoutOwner);
    newProject.owner = currentUser;

    return await this.projectRepository.save(newProject);
  }

  /**
   * A method that updates a project in the database
   * @param userId An userId from JWT
   * @param projectId A projectId of a project. A project with this id should exist in the database
   */
  async updateProject(
    projectDto: CreateProjectDto,
    userId: string,
    projectId: string,
  ): Promise<ProjectEntity> {
    this.validateHexColor(projectDto.color);
    const { owner_id, ...dtoWithoutOwner } = projectDto;
    this.idsMatching(owner_id, userId);

    const currentProject = await this.getValidProject(projectId, userId);

    if (currentProject.title !== projectDto.title) {
      await this.checkDuplicateProjectTitle(projectDto.title, userId);
    }

    Object.assign(currentProject, dtoWithoutOwner);

    return await this.projectRepository.save(currentProject);
  }

  /**
   * A method that deletes a project from the database. Files related to this project are also deleted from the storage.
   * @param userId An userId from JWT
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @returns A promise with the id of deleted project
   */
  async deleteProject(userId: string, projectId: string): Promise<{ id: string }> {
    await this.getValidProject(projectId, userId);
    const projectTasksAttachmentsPaths = await this.fetchProjectTasksAttachmentsPaths(projectId);
    const projectTasksCommentsAttachmentsPaths =
      await this.fetchProjectTasksCommentsAttachmentsPaths(projectId);

    await this.projectRepository.delete({ id: projectId });
    await this.utilsService.removeFilesFromStorage([
      ...projectTasksAttachmentsPaths,
      ...projectTasksCommentsAttachmentsPaths,
    ]);

    return { id: projectId };
  }

  /**
   * A method that fetches tasks attachments from the database that belong to the project
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @returns A promise with the list of attachments paths
   */
  async fetchProjectTasksAttachmentsPaths(projectId: string): Promise<string[]> {
    const projectTasksAttachmentsPaths = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.tasks', 'tasks')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('projects.id = :id', { id: projectId })
      .select('attachments.path')
      .getRawMany();

    return projectTasksAttachmentsPaths.map((path) => path.attachments_path);
  }

  /**
   * A method that fetches comments attachments from the database that belong to the project
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @returns A promise with the list of attachments paths
   */
  async fetchProjectTasksCommentsAttachmentsPaths(projectId: string): Promise<string[]> {
    const projectTasksCommentsAttachmentsPaths = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.tasks', 'tasks')
      .leftJoinAndSelect('tasks.comments', 'comments')
      .leftJoinAndSelect('comments.attachments', 'attachments')
      .andWhere('projects.id = :id', { id: projectId })
      .select('attachments.path')
      .getRawMany();

    return projectTasksCommentsAttachmentsPaths.map((path) => path.attachments_path);
  }

  /**
   * A method that fetches a project from the database
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @param userId An userId from JWT
   */
  async fetchProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new InternalServerErrorException(
        `Entity ProjectModel, id=${projectId} not found in the database`,
      );
    }

    // if (project.owner.id !== userId) {
    //   throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
    // }

    return project;
  }

  /**
   * A method that checks if the project is available for editing
   * @param projectId A projectId of a project. A project with this id should exist in the database
   * @param userId An userId from JWT
   */
  async getValidProject(projectId: string, userId: string): Promise<ProjectEntity> {
    const project = await this.fetchProject(userId, projectId);

    if (project.title === SPECIAL_ONE_PROJECT_NAME) {
      throw new UnprocessableEntityException(ProjectMessageEnum.PROJECT_PROTECTED);
    }

    return project;
  }

  /**
   * A method that checks for duplicate project titles of the user
   * @param title A title of a project
   * @param id An id of a user
   */
  async checkDuplicateProjectTitle(title: string, id: string): Promise<void> {
    const project = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .where('projects.title = :title', { title })
      .andWhere('owner.id = :id', { id })
      .getOne();

    if (project) {
      throw new UnprocessableEntityException(ProjectMessageEnum.PROJECT_DUPLICATE);
    }
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
   * A method that adds the owner_id property to Project according to the requirements
   */
  getRequiredFormatProject(project: ProjectApiDto): ProjectApiDto {
    project.owner_id = project.owner.id;

    return project;
  }

  /**
   * A method that fetches a project by title from the database
   * @param title A title of a project
   * @param currentUserId An id of a user
   */
  async fetchProjectByTitle(title: string, currentUserId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .where('projects.title = :title', { title: title })
      .andWhere('projects.owner_id = :id', { id: currentUserId })
      .getOne();

    if (!project) {
      throw new NotFoundException(ProjectMessageEnum.PROJECT_NOT_EXIST);
    }

    return project;
  }
}
