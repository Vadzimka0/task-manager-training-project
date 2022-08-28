import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { Data } from '../common/types/data';
import { UserEntity } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { TaskApiType } from './types/task-api.type';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasks/:taskId')
  async fetchOneTask(
    @User('id') userId: string,
    @Param('taskId') taskId: string,
  ): Promise<Data<TaskApiType>> {
    const data = await this.taskService.fetchOneTask(userId, taskId);
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

  @Get('project-tasks/:projectId')
  async fetchProjectTasks(
    @User('id') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Data<TaskApiType[]>> {
    const data = await this.taskService.fetchProjectTasks(userId, projectId);
    return { data };
  }

  @Post('tasks')
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
}
