import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { EntityId } from '../../shared/classes';
import { Data } from '../../shared/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../../shared/decorators';
import { MessageEnum, ProjectMessageEnum } from '../../shared/enums/messages.enum';
import { getApiParam } from '../../shared/swagger-utils/getApiParam';
import { UserEntity } from '../../user/entities/user.entity';
import { TaskApiDto } from '../dto/api-dto/task-api.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from '../services';

@ApiTags('Tasks:')
@Controller()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('tasks')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create New Task' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(TaskApiDto)
  @ApiNotFoundResponse({ description: `"${ProjectMessageEnum.PROJECT_NOT_EXIST}"` })
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  async createTask(
    @Body() taskDto: CreateTaskDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<TaskApiDto>> {
    const task = await this.taskService.createTask(taskDto, currentUser);
    const data = this.taskService.getRequiredFormatTask(task as TaskApiDto);
    return { data };
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Update Task' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(TaskApiDto)
  @ApiNotFoundResponse({ description: `"${ProjectMessageEnum.PROJECT_NOT_EXIST}"` })
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'task'))
  async updateTask(
    @Body() taskDto: CreateTaskDto,
    @User() currentUser: UserEntity,
    @Param('id') taskId: string,
  ): Promise<Data<TaskApiDto>> {
    const task = await this.taskService.updateTask(taskDto, currentUser, taskId);
    const data = this.taskService.getRequiredFormatTask(task as TaskApiDto);
    return { data };
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete Task' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(EntityId)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'task'))
  async deleteTask(
    @User('id') userId: string,
    @Param('id') taskId: string,
  ): Promise<Data<EntityId>> {
    const data = await this.taskService.deleteTask(userId, taskId);
    return { data };
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Fetch One Task' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(TaskApiDto)
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'task'))
  async fetchTask(@Param('id') id: string): Promise<Data<TaskApiDto>> {
    const task = await this.taskService.fetchTask(id);
    const data = this.taskService.getRequiredFormatTask(task as TaskApiDto);
    return { data };
  }

  @Get('project-tasks/:projectId')
  @ApiOperation({ summary: 'Fetch Project Tasks' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(TaskApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('projectId', 'project'))
  async fetchProjectTasks(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<TaskApiDto[]>> {
    const tasks = await this.taskService.fetchProjectTasks(userId, projectId);
    const data = tasks.map((task: TaskApiDto) => this.taskService.getRequiredFormatTask(task));
    return { data };
  }

  @Get('user-tasks/:ownerId')
  @ApiOperation({ summary: "Fetch User's Tasks" })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(TaskApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchUserTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiDto[]>> {
    const tasks = await this.taskService.fetchUserTasks(userId, ownerId);
    const data = tasks.map((task: TaskApiDto) => this.taskService.getRequiredFormatTask(task));
    return { data };
  }

  @Get('assigned-tasks/:ownerId')
  @ApiOperation({ summary: 'Fetch Assigned To User Tasks' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(TaskApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchAssignedTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiDto[]>> {
    const tasks = await this.taskService.fetchAssignedTasks(userId, ownerId);
    const data = tasks.map((task: TaskApiDto) => this.taskService.getRequiredFormatTask(task));
    return { data };
  }

  @Get('participate-in-tasks/:ownerId')
  @ApiOperation({ summary: 'Fetch Tasks Where User As Member' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(TaskApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.INVALID_USER_ID}"` })
  @ApiParam(getApiParam('ownerId', 'user'))
  async fetchParticipateInTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiDto[]>> {
    const tasks = await this.taskService.fetchParticipateInTasks(userId, ownerId);
    const data = tasks.map((task: TaskApiDto) => this.taskService.getRequiredFormatTask(task));
    return { data };
  }
}
