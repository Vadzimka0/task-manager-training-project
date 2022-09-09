import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services';
import { UserApiType, UserStatisticsApiType } from '../types';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  async fetchUser(@Param('id') id: string): Promise<Data<UserApiType>> {
    const data = await this.userService.fetchUser(id);
    return { data };
  }

  @Get('task-members-search')
  async fetchMembersBySearch(@Query() querySearch: { query: string }): Promise<Data<UserEntity[]>> {
    const data = await this.userService.fetchMembersBySearch(querySearch);
    return { data };
  }

  @Get('users-statistics/:ownerId')
  async fetchUserStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<UserStatisticsApiType>> {
    const data = await this.userService.fetchUserStatistics(userId, ownerId);
    return { data };
  }
}
