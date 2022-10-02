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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/classes/response-data';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from '../services';
import { TaskApiType } from '../types';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('tasks')
  @HttpCode(200)
  async createTask(
    @Body() taskDto: CreateTaskDto,
    @User() currentUser: UserEntity,
  ): Promise<Data<TaskApiType>> {
    const data = await this.taskService.createTask(taskDto, currentUser);
    return { data };
  }

  @Put('tasks/:id')
  async updateTask(
    @Body() taskDto: CreateTaskDto,
    @User() currentUser: UserEntity,
    @Param('id') taskId: string,
  ): Promise<Data<TaskApiType>> {
    const data = await this.taskService.updateTask(taskDto, currentUser, taskId);
    return { data };
  }

  @Delete('tasks/:id')
  async deleteTask(
    @User('id') userId: string,
    @Param('id') taskId: string,
  ): Promise<Data<{ id: string }>> {
    const data = await this.taskService.deleteTask(userId, taskId);
    return { data };
  }

  @Get('tasks/:taskId')
  async fetchOneTask(@Param('taskId') taskId: string): Promise<Data<TaskApiType>> {
    const data = await this.taskService.fetchOneTask(taskId);
    return { data };
  }

  @Get('project-tasks/:projectId')
  async fetchProjectTasks(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<TaskApiType[]>> {
    const data = await this.taskService.fetchProjectTasks(userId, projectId);
    return { data };
  }

  @Get('user-tasks/:ownerId')
  async fetchUserTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiType[]>> {
    const data = await this.taskService.fetchUserTasks(userId, ownerId);
    return { data };
  }

  @Get('assigned-tasks/:ownerId')
  async fetchAssignedTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiType[]>> {
    const data = await this.taskService.fetchAssignedTasks(userId, ownerId);
    return { data };
  }

  @Get('participate-in-tasks/:ownerId')
  async fetchParticipateInTasks(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<TaskApiType[]>> {
    const data = await this.taskService.fetchParticipateInTasks(userId, ownerId);
    return { data };
  }
}
