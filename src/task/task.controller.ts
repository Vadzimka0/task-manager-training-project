import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards';
import { UserEntity } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // @Get()
  // async findAllAuthorsTasks(@User('id') userId: number): Promise<any> {
  //   return this.taskService.findAllAuthorsTasks(userId);
  // }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User() currentUser: UserEntity,
  ): Promise<any> {
    const task = await this.taskService.createTask(createTaskDto, currentUser);
    return task;
  }

  @Put(':id')
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @User() currentUser: UserEntity,
    @Param('id') taskId: number,
  ): Promise<any> {
    const task = await this.taskService.updateTask(updateTaskDto, currentUser, taskId);
    return task;
  }

  @Delete(':id')
  async deleteTask(@User('id') userId: number, @Param('id') taskId: number): Promise<any> {
    const task = await this.taskService.deleteTask(userId, taskId);
    return task;
  }
}
