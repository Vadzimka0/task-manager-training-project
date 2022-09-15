import {
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
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectApiType, ProjectStatisticApiType } from './types';

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
  ): Promise<ProjectApiType[]> {
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
    const projectsWithOwnerId = projects.map((project: ProjectApiType) =>
      this.getProjectWithOwnerId(project),
    );
    return projectsWithOwnerId;
  }

  async fetchOneProject(userId: string, projectId: string): Promise<ProjectApiType> {
    const project = await this.findProjectForRead(projectId, userId);
    return this.getProjectWithOwnerId(project as ProjectApiType);
  }

  async fetchProjectStatistics(
    userId: string,
    ownerId: string,
  ): Promise<ProjectStatisticApiType[]> {
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

    return tasksNumbers.map((projectInfo: ProjectStatisticApiType) => ({
      ...projectInfo,
      tasks_number: Number(projectInfo.tasks_number),
    }));
  }

  async createProject(
    projectDto: CreateProjectDto,
    currentUser: UserEntity,
  ): Promise<ProjectApiType> {
    this.validateHexColor(projectDto.color);
    const { owner_id, ...dtoWithoutOwner } = projectDto;
    this.idsMatching(owner_id, currentUser.id);
    await this.checkDuplicateProjectTitle(projectDto.title, currentUser.id);

    const newProject = new ProjectEntity();
    Object.assign(newProject, dtoWithoutOwner);
    newProject.owner = currentUser;

    const savedProject = await this.projectRepository.save(newProject);
    return this.getProjectWithOwnerId(savedProject as ProjectApiType);
  }

  async updateProject(
    projectDto: CreateProjectDto,
    userId: string,
    projectId: string,
  ): Promise<ProjectApiType> {
    this.validateHexColor(projectDto.color);
    const { owner_id, ...dtoWithoutOwner } = projectDto;
    this.idsMatching(owner_id, userId);

    const currentProject = await this.findProjectForEdit(projectId, userId);
    if (currentProject.title !== projectDto.title) {
      await this.checkDuplicateProjectTitle(projectDto.title, userId);
    }
    Object.assign(currentProject, dtoWithoutOwner);

    const savedProject = await this.projectRepository.save(currentProject);
    return this.getProjectWithOwnerId(savedProject as ProjectApiType);
  }

  async deleteProject(userId: string, projectId: string): Promise<{ id: string }> {
    await this.findProjectForEdit(projectId, userId);
    await this.projectRepository.delete({ id: projectId });
    return { id: projectId };
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
        throw new ForbiddenException('Invalid ID. You are not an owner');
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
      throw new ForbiddenException('This project cannot be edited or deleted');
    }
    return project;
  }

  async checkDuplicateProjectTitle(title: string, id: string): Promise<void> {
    const project = await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .andWhere('projects.title = :title', { title })
      .andWhere('projects.owner_id = :id', { id })
      .getOne();
    if (project) {
      throw new ForbiddenException('Project with that name already exists');
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
      throw new UnprocessableEntityException('The user id is not valid');
    }
  }

  getProjectWithOwnerId(project: ProjectApiType): ProjectApiType {
    project.owner_id = project.owner.id;
    return project;
  }

  async findProjectByTitle(title: string, currentUserId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository
      .createQueryBuilder('projects')
      .where('projects.title = :title', { title: title })
      .andWhere('projects.owner_id = :id', { id: currentUserId })
      .getOne();
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }
    return project;
  }
}
