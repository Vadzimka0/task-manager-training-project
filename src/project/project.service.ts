import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../common/constants/default-constants';
import { MessageEnum, ProjectMessageEnum } from '../common/enums/message.enum';
import { UserEntity } from '../user/entities/user.entity';
import { removeFilesFromStorage } from '../utils';
import { CreateProjectDto, ProjectApiDto, ProjectStatisticApiDto } from './dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async fetchUserProjects(
    userId: string,
    ownerId?: string,
    search?: { query: string },
  ): Promise<ProjectApiDto[]> {
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

    const projects = await queryBuilder.getMany();

    return projects.map((project: ProjectApiDto) => this.getProjectWithOwnerId(project));
  }

  async fetchOneProject(userId: string, projectId: string): Promise<ProjectApiDto> {
    const project = await this.findProjectForRead(projectId, userId);

    return this.getProjectWithOwnerId(project as ProjectApiDto);
  }

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

  async createProject(
    projectDto: CreateProjectDto,
    currentUser: UserEntity,
  ): Promise<ProjectApiDto> {
    this.validateHexColor(projectDto.color);

    const { owner_id, ...dtoWithoutOwner } = projectDto;

    this.idsMatching(owner_id, currentUser.id);
    await this.checkDuplicateProjectTitle(projectDto.title, currentUser.id);

    const newProject = new ProjectEntity();
    Object.assign(newProject, dtoWithoutOwner);
    newProject.owner = currentUser;
    const savedProject = await this.projectRepository.save(newProject);

    return this.getProjectWithOwnerId(savedProject as ProjectApiDto);
  }

  async updateProject(
    projectDto: CreateProjectDto,
    userId: string,
    projectId: string,
  ): Promise<ProjectApiDto> {
    this.validateHexColor(projectDto.color);
    const { owner_id, ...dtoWithoutOwner } = projectDto;
    this.idsMatching(owner_id, userId);

    const currentProject = await this.findProjectForEdit(projectId, userId);

    if (currentProject.title !== projectDto.title) {
      await this.checkDuplicateProjectTitle(projectDto.title, userId);
    }

    Object.assign(currentProject, dtoWithoutOwner);
    const savedProject = await this.projectRepository.save(currentProject);

    return this.getProjectWithOwnerId(savedProject as ProjectApiDto);
  }

  async deleteProject(userId: string, projectId: string): Promise<{ id: string }> {
    await this.findProjectForEdit(projectId, userId);
    const projectTasksAttachmentsPaths = await this.getProjectTasksAttachmentsPaths(projectId);
    const projectTasksCommentsAttachmentsPaths = await this.getProjectTasksCommentsAttachmentsPaths(
      projectId,
    );

    await this.projectRepository.delete({ id: projectId });
    await removeFilesFromStorage([
      ...projectTasksAttachmentsPaths,
      ...projectTasksCommentsAttachmentsPaths,
    ]);

    return { id: projectId };
  }

  async getProjectTasksAttachmentsPaths(projectId: string): Promise<string[]> {
    const projectTasksAttachmentsPaths = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.tasks', 'tasks')
      .leftJoinAndSelect('tasks.attachments', 'attachments')
      .andWhere('projects.id = :id', { id: projectId })
      .select('attachments.path')
      .getRawMany();

    return projectTasksAttachmentsPaths.map((path) => path.attachments_path);
  }

  async getProjectTasksCommentsAttachmentsPaths(projectId: string): Promise<string[]> {
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

  async findProjectForRead(projectId: string, userId: string): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository.findOneBy({ id: projectId });

      if (!project) {
        throw new InternalServerErrorException(
          `Entity ProjectModel, id=${projectId} not found in the database`,
        );
      }

      if (project.owner.id !== userId) {
        throw new ForbiddenException(MessageEnum.INVALID_ID_NOT_OWNER);
      }

      return project;
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findProjectForEdit(projectId: string, userId: string): Promise<ProjectEntity> {
    const project = await this.findProjectForRead(projectId, userId);

    if (project.title === SPECIAL_ONE_PROJECT_NAME) {
      throw new BadRequestException(ProjectMessageEnum.PROJECT_PROTECTED);
    }

    return project;
  }

  async checkDuplicateProjectTitle(title: string, id: string): Promise<void> {
    const project = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .where('projects.title = :title', { title })
      .andWhere('owner.id = :id', { id })
      .getOne();

    if (project) {
      throw new BadRequestException(ProjectMessageEnum.PROJECT_DUPLICATE);
    }
  }

  validateHexColor(color: string): void {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_COLOR);
    }
  }

  idsMatching(owner_id: string, user_id: string): void {
    if (owner_id !== user_id) {
      throw new UnprocessableEntityException(MessageEnum.INVALID_USER_ID);
    }
  }

  getProjectWithOwnerId(project: ProjectApiDto): ProjectApiDto {
    project.owner_id = project.owner.id;

    return project;
  }

  async findProjectByTitle(title: string, currentUserId: string): Promise<ProjectEntity> {
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
