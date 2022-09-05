import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('task-members-search')
  async fetchMembersBySearch(@Query() querySearch: { query: string }): Promise<Data<UserEntity[]>> {
    const data = await this.userService.fetchMembersBySearch(querySearch);
    return { data };
  }

  @Get('users')
  async getAllUsers(): Promise<{ users: UserEntity[] }> {
    const users = await this.userService.getAllUsers();
    return { users };
  }
}
