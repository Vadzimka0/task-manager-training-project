import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { SPECIAL_ONE_PROJECT_NAME } from '../common/constants/default-constants';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectResponseInterface } from './types/projectResponse.interface';
import { ProjectsResponseInterface } from './types/projectsResponse.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async findAllAuthorsProjects(userId: string): Promise<ProjectsResponseInterface> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.owner', 'owner')
      .andWhere('projects.ownerId = :id', { id: userId })
      .orderBy('projects.created_at', 'DESC');

    const [projects, projectsCount] = await queryBuilder.getManyAndCount();
    return { projects, projectsCount };
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    currentUser: UserEntity,
  ): Promise<ProjectEntity> {
    const newProject = new ProjectEntity();

    // check duplicate owner's projects

    Object.assign(newProject, createProjectDto);
    newProject.owner = currentUser;
    return await this.projectRepository.save(newProject);
  }

  async updateProject(
    updateProjectDto: UpdateProjectDto,
    userId: string,
    projectId: string,
  ): Promise<ProjectEntity> {
    const currentProject = await this.findAndValidateProject(userId, projectId);

    // check duplicate owner's projects

    Object.assign(currentProject, updateProjectDto);
    return await this.projectRepository.save(currentProject);
  }

  async deleteProject(userId: string, projectId: string): Promise<DeleteResult> {
    await this.findAndValidateProject(userId, projectId);
    return await this.projectRepository.delete({ id: projectId });
  }

  async findAndValidateProject(userId: string, projectId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
    }
    if (project.owner.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    if (project.title === SPECIAL_ONE_PROJECT_NAME) {
      throw new HttpException('This project cannot be edited or deleted', HttpStatus.FORBIDDEN);
    }
    return project;
  }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    return { project };
  }

  async getTagByTitleAndUserId(title: string, currentUserId: string): Promise<ProjectEntity> {
    const currentProject = await this.projectRepository
      .createQueryBuilder('projects')
      .where('projects.title = :title', { title: title })
      .andWhere('projects.ownerId = :id', { id: currentUserId })
      .getOne();

    if (!currentProject) {
      throw new HttpException('Tag (project) does not exist', HttpStatus.NOT_FOUND);
    }
    return currentProject;
  }
}
