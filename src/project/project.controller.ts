import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { EntityId } from '../shared/classes';
import { Data } from '../shared/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../shared/decorators';
import { MessageEnum, ProjectMessageEnum } from '../shared/enums/messages.enum';
import { getApiParam } from '../shared/swagger-utils/getApiParam';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProjectDto, ProjectApiDto, ProjectStatisticApiDto } from './dto';
import { ProjectService } from './project.service';

@ApiTags('Projects:')
@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('projects')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Project' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: 
      "${MessageEnum.INVALID_COLOR}"; 
      "${MessageEnum.INVALID_USER_ID}"; 
      "${ProjectMessageEnum.PROJECT_DUPLICATE}";
    `,
  })
  async createProject(
    @Body() projectDto: CreateProjectDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ProjectApiDto>> {
    const project = await this.projectService.createProject(projectDto, currentUser);
    const data = this.projectService.getRequiredFormatProject(project as ProjectApiDto);
    return { data };
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update Project' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: 
      "${MessageEnum.INVALID_COLOR}"; 
      "${MessageEnum.INVALID_USER_ID}"; 
      "${ProjectMessageEnum.PROJECT_PROTECTED}"; 
      "${ProjectMessageEnum.PROJECT_DUPLICATE}";
    `,
  })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'project'))
  async updateProject(
    @Body() projectDto: CreateProjectDto,
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<ProjectApiDto>> {
    const project = await this.projectService.updateProject(projectDto, userId, projectId);
    const data = this.projectService.getRequiredFormatProject(project as ProjectApiDto);
    return { data };
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete Project' })
  @ApiOkObjectResponse(EntityId)
  @ApiBearerAuth('access-token')
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiUnprocessableEntityResponse({ description: `"${ProjectMessageEnum.PROJECT_PROTECTED}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'project'))
  async deleteProject(
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<EntityId>> {
    const data = await this.projectService.deleteProject(userId, projectId);
    return { data };
  }

  @Get('user-projects/:ownerId')
  @ApiOperation({ summary: "Fetch User's Projects" })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(ProjectApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}";` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchAllUserProjects(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectApiDto[]>> {
    const projects = await this.projectService.fetchUserProjects(userId, ownerId);
    const data = projects.map((project: ProjectApiDto) =>
      this.projectService.getRequiredFormatProject(project),
    );
    return { data };
  }

  @Get('projects-search')
  @ApiOperation({ summary: "Fetch User's Projects By Search Query" })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(ProjectApiDto)
  @ApiQuery({ name: 'query', example: 'Pers' })
  async fetchProjectsBySearch(
    @User('id') userId: string,
    @Query() querySearch: { query: string },
  ): Promise<Data<ProjectApiDto[]>> {
    const projects = await this.projectService.fetchUserProjects(userId, undefined, querySearch);
    const data = projects.map((project: ProjectApiDto) =>
      this.projectService.getRequiredFormatProject(project),
    );
    return { data };
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: "Fetch One User's Project" })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('projectId', 'project'))
  async fetchProject(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<ProjectApiDto>> {
    const project = await this.projectService.fetchProject(userId, projectId);
    const data = this.projectService.getRequiredFormatProject(project as ProjectApiDto);
    return { data };
  }

  @Get('projects-statistics/:ownerId')
  @ApiOperation({ summary: 'Fetch Projects Statistics' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(ProjectStatisticApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}";` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchProjectStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectStatisticApiDto[]>> {
    const data = await this.projectService.fetchProjectStatistics(userId, ownerId);
    return { data };
  }
}
