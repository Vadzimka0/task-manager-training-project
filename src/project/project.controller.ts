import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { Data } from '../common/types/data';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { ProjectType } from './types/project.type';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('user-projects/:ownerId')
  async fetchAllUserProjects(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectType[]>> {
    const data = await this.projectService.fetchUserProjects(userId, ownerId);
    return { data };
  }

  @Get('projects-search')
  async fetchProjectsBySearch(
    @User('id') userId: string,
    @Query() querySearch: { query: string },
  ): Promise<Data<ProjectType[]>> {
    const data = await this.projectService.fetchUserProjects(userId, undefined, querySearch);
    return { data };
  }

  @Get('projects/:projectId')
  async fetchOneProject(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<ProjectType>> {
    const data = await this.projectService.fetchOneProject(userId, projectId);
    return { data };
  }

  @Post('projects')
  async createProject(
    @Body() projectDto: CreateProjectDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ProjectType>> {
    const data = await this.projectService.createProject(projectDto, currentUser);
    return { data };
  }

  @Put('projects/:id')
  async updateProject(
    @Body() projectDto: CreateProjectDto,
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<ProjectType>> {
    const data = await this.projectService.updateProject(projectDto, userId, projectId);
    return { data };
  }

  @Delete('projects/:id')
  async deleteProject(
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.projectService.deleteProject(userId, projectId);
    return { data };
  }
}
