import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator';

import { JwtAuthGuard } from '../auth/guards';
import { Data } from '../common/types/data';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('task-members-search')
  async fetchMembersBySearch(
    @User('id') userId: string,
    @Query() querySearch: { query: string },
    // ): Promise<Data<UserApiType[]>> {
  ): Promise<Data<any>> {
    const data = await this.userService.fetchMembersBySearch(userId, querySearch);
    return { data };
  }

  @Get()
  async getAllUsers(): Promise<{ users: UserEntity[] }> {
    const users = await this.userService.getAllUsers();
    return { users };
  }
}
