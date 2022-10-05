import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { EntityId } from '../common/classes';
import { Data } from '../common/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../common/decorators';
import { MessageEnum, ProjectMessageEnum } from '../common/enums/message.enum';
import { UserEntity } from '../user/entities/user.entity';
import { getApiParam } from '../utils';
import { CreateProjectDto, ProjectApiDto, ProjectStatisticApiDto } from './dto';
import { ProjectService } from './project.service';

@ApiTags('Projects:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('projects')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Project' })
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `"${ProjectMessageEnum.PROJECT_DUPLICATE}";`,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}"`,
  })
  @ApiBearerAuth('access-token')
  async createProject(
    @Body() projectDto: CreateProjectDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<ProjectApiDto>> {
    const data = await this.projectService.createProject(projectDto, currentUser);
    return { data };
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update Project' })
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Possible reasons: "${ProjectMessageEnum.PROJECT_PROTECTED}"; "${ProjectMessageEnum.PROJECT_DUPLICATE}";`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";`,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `Possible reasons: "${MessageEnum.INVALID_COLOR}"; "${MessageEnum.INVALID_USER_ID}";`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `"${MessageEnum.ENTITY_NOT_FOUND}";`,
  })
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('id', 'project'))
  async updateProject(
    @Body() projectDto: CreateProjectDto,
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<ProjectApiDto>> {
    const data = await this.projectService.updateProject(projectDto, userId, projectId);
    return { data };
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete Project' })
  @ApiOkObjectResponse(EntityId)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `"${ProjectMessageEnum.PROJECT_PROTECTED}";`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `"${MessageEnum.ENTITY_NOT_FOUND}";`,
  })
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('id', 'project'))
  async deleteProject(
    @User('id') userId: string,
    @Param('id') projectId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.projectService.deleteProject(userId, projectId);
    return { data };
  }

  @Get('user-projects/:ownerId')
  @ApiOperation({ summary: "Fetch User's Projects" })
  @ApiOkArrayResponse(ProjectApiDto)
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `"${MessageEnum.INVALID_USER_ID}";`,
  })
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchAllUserProjects(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectApiDto[]>> {
    const data = await this.projectService.fetchUserProjects(userId, ownerId);
    return { data };
  }

  @Get('projects-search')
  @ApiOperation({ summary: "Fetch User's Projects By Search Query" })
  @ApiOkArrayResponse(ProjectApiDto)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'query', example: '?query=Pers' })
  async fetchProjectsBySearch(
    @User('id') userId: string,
    @Query() querySearch: { query: string },
  ): Promise<Data<ProjectApiDto[]>> {
    const data = await this.projectService.fetchUserProjects(userId, undefined, querySearch);
    return { data };
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: "Fetch One User's Projects" })
  @ApiOkObjectResponse(ProjectApiDto)
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `"${MessageEnum.INVALID_ID_NOT_OWNER}";`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: `"${MessageEnum.ENTITY_NOT_FOUND}";`,
  })
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('projectId', 'project'))
  async fetchOneProject(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<ProjectApiDto>> {
    const data = await this.projectService.fetchOneProject(userId, projectId);
    return { data };
  }

  @Get('projects-statistics/:ownerId')
  @ApiOperation({ summary: 'Fetch Projects Statistics' })
  @ApiOkArrayResponse(ProjectStatisticApiDto)
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `"${MessageEnum.INVALID_USER_ID}";`,
  })
  @ApiBearerAuth('access-token')
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchProjectStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<ProjectStatisticApiDto[]>> {
    const data = await this.projectService.fetchProjectStatistics(userId, ownerId);
    return { data };
  }
}
