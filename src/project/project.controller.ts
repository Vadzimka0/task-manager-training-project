import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { ProjectResponseInterface } from './types/projectResponse.interface';
import { ProjectsResponseInterface } from './types/projectsResponse.interface';

@Controller('projects')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAllAuthorsProjects(@User('id') userId: number): Promise<ProjectsResponseInterface> {
    return this.projectService.findAllAuthorsProjects(userId);
  }

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @User() currentUser: UserEntity,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectService.createProject(createProjectDto, currentUser);
    return this.projectService.buildProjectResponse(project);
  }

  @Patch(':id')
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @User('id') userId: number,
    @Param('id') projectId: number,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectService.updateProject(updateProjectDto, userId, projectId);
    return this.projectService.buildProjectResponse(project);
  }

  @Delete(':id')
  async deleteProject(
    @User('id') userId: number,
    @Param('id') projectId: number,
  ): Promise<DeleteResult> {
    return await this.projectService.deleteProject(userId, projectId);
  }
}
