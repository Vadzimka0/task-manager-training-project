import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ProjectApiType, ProjectStatisticApiType } from './types';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('user-projects/:ownerId')
  async fetchAllUserProjects(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectApiType[]>> {
    const data = await this.projectService.fetchUserProjects(userId, ownerId);
    return { data };
  }

  @Get('projects-search')
  async fetchProjectsBySearch(
    @User('id') userId: string,
    @Query() querySearch: { query: string },
  ): Promise<Data<ProjectApiType[]>> {
    const data = await this.projectService.fetchUserProjects(userId, undefined, querySearch);
    return { data };
  }

  @Get('projects/:projectId')
  async fetchOneProject(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<ProjectApiType>> {
    const data = await this.projectService.fetchOneProject(userId, projectId);
    return { data };
  }

  @Get('projects-statistics/:ownerId')
  async fetchProjectStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectStatisticApiType[]>> {
    const data = await this.projectService.fetchProjectStatistics(userId, ownerId);
    return { data };
  }

  @Post('projects')
  @HttpCode(200)
  async createProject(
    @Body() projectDto: CreateProjectDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ProjectApiType>> {
    const data = await this.projectService.createProject(projectDto, currentUser);
    return { data };
  }

  @Put('projects/:id')
  async updateProject(
    @Body() projectDto: CreateProjectDto,
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<ProjectApiType>> {
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
