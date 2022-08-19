import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectService } from '../project/project.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}
  // async findAllAuthorsTasks(userId: number): Promise<any> {
  //   const queryBuilder = this.taskRepository
  //     .createQueryBuilder('tasks')
  //     .leftJoinAndSelect('tasks.author', 'author')
  //     .andWhere('tasks.authorId = :id', { id: userId })
  //     .orderBy('tasks.createdAt', 'DESC');
  //   const [tasks, tasksCount] = await queryBuilder.getManyAndCount();
  //   return { tasks, tasksCount };
  // }

  async createTask(createTaskDto: CreateTaskDto, currentUser: UserEntity): Promise<TaskEntity> {
    const newTask = new TaskEntity();
    Object.assign(newTask, createTaskDto);
    newTask.author = currentUser;

    const currentProject = await this.projectService.getByTag(createTaskDto.tag, currentUser);
    newTask.tag = currentProject;

    const performer = await this.userService.getByName(createTaskDto.performer, currentUser);
    newTask.performer = performer;

    return await this.taskRepository.save(newTask);
  }
}
