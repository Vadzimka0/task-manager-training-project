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

  async findAllAuthorsProjects(userId: number): Promise<ProjectsResponseInterface> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.author', 'author')
      .andWhere('projects.authorId = :id', { id: userId })
      .orderBy('projects.createdAt', 'DESC');

    const [projects, projectsCount] = await queryBuilder.getManyAndCount();
    return { projects, projectsCount };
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    currentUser: UserEntity,
  ): Promise<ProjectEntity> {
    const newProject = new ProjectEntity();
    Object.assign(newProject, createProjectDto);
    newProject.author = currentUser;
    return await this.projectRepository.save(newProject);
  }

  async updateProject(
    updateProjectDto: UpdateProjectDto,
    userId: number,
    projectId: number,
  ): Promise<ProjectEntity> {
    const currentProject = await this.findAndValidateProject(userId, projectId);
    Object.assign(currentProject, updateProjectDto);
    return await this.projectRepository.save(currentProject);
  }

  async deleteProject(userId: number, projectId: number): Promise<DeleteResult> {
    await this.findAndValidateProject(userId, projectId);
    return await this.projectRepository.delete({ id: projectId });
  }

  async findAndValidateProject(userId: number, projectId: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
    }
    if (project.author.id !== userId) {
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

  async getByTag(tag: string | null, currentUser: UserEntity): Promise<ProjectEntity> {
    let nameProject: string;
    tag ? (nameProject = tag) : (nameProject = SPECIAL_ONE_PROJECT_NAME);
    const currentProject = await this.projectRepository.findOneBy({ title: nameProject });
    if (!currentProject) {
      throw new HttpException('Tag (project) does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentProject.author.id !== currentUser.id) {
      throw new HttpException('Such a Tag (project) does not belong to you', HttpStatus.FORBIDDEN);
    }
    return currentProject;
  }
}
