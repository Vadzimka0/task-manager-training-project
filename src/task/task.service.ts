import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectService } from '../project/project.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
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
    // optional
    newTask.author = currentUser;

    const currentProject = await this.projectService.getByTagTitle(
      createTaskDto.tag.title,
      currentUser.id,
    );
    newTask.tag = currentProject;

    const { performer, members } = createTaskDto;
    await this.addPerformerAndMembers(newTask, currentUser, performer.username, members);

    return await this.taskRepository.save(newTask);
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    userId: number,
    taskId: number,
  ): Promise<TaskEntity> {
    const currentTask = await this.findAndValidateTask(userId, taskId);
    Object.assign(currentTask, updateTaskDto);
    // newTask.author = currentUser;

    if (currentTask.tag.title !== updateTaskDto.tag.title) {
      currentTask.tag = await this.projectService.getByTagTitle(updateTaskDto.tag.title, userId);
    }

    // const { performer, members } = updateTaskDto;
    // await this.addPerformerAndMembers(currentTask, currentUser, performer.username, members);
    return await this.taskRepository.save(currentTask);
  }

  async addPerformerAndMembers(
    task: TaskEntity,
    user: UserEntity,
    performer: string,
    members: string[],
  ): Promise<void> {
    if (performer) {
      const currentPerformer = await this.userService.getByName(performer);
      task.performer = currentPerformer;
    } else {
      task.performer = user;
    }
    if (members) {
      const currentMembers = await this.userService.getMembers(members);
      task.members = currentMembers;
    }
  }

  async findAndValidateTask(userId: number, taskId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['tag'],
    });
    if (!task) {
      throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND);
    }
    if (task.tag.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return task;
  }
}
