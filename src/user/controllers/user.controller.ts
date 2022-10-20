import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/classes/response-data';
import { ApiOkArrayResponse, ApiOkObjectResponse } from '../../common/decorators';
import { MessageEnum } from '../../common/enums/messages.enum';
import { getApiParam } from '../../utils';
import { UserApiDto } from '../dto/user-api.dto';
import { UserStatisticsApiDto } from '../dto/user-statistics-api.dto';
import { UserEntity } from '../entities/user.entity';
import { UserAvatarService, UserService } from '../services';
import { UserApiType } from '../types';

@ApiTags('Users:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAvatarService: UserAvatarService,
  ) {}

  @Get('users/:id')
  @ApiOperation({ summary: 'Fetch User' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(UserApiDto)
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'user'))
  async fetchUser(@Param('id') id: string): Promise<Data<UserApiDto>> {
    const user = await this.userService.fetchUserById(id);
    const data = this.userAvatarService.getRequiredFormatUser(user as UserApiType);
    return { data };
  }

  @Get('task-members-search')
  @ApiOperation({ summary: 'Fetch Members By Search Query' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(UserApiDto)
  @ApiQuery({ name: 'query', example: 'afa' })
  async fetchMembersBySearch(@Query() querySearch: { query: string }): Promise<Data<UserEntity[]>> {
    const users = await this.userService.fetchMembersBySearch(querySearch);
    const data = users.map((user) =>
      this.userAvatarService.getRequiredFormatUser(user as UserApiType),
    );
    return { data };
  }

  @Get('users-statistics/:ownerId')
  @ApiOperation({ summary: 'Fetch User Statistics' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(UserStatisticsApiDto)
  @ApiUnprocessableEntityResponse({
    description: `"${MessageEnum.INVALID_USER_ID_STATISTICS_ONLY_TO_YOU}";`,
  })
  @ApiParam(getApiParam('ownerId', 'user'))
  async getUserStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<UserStatisticsApiDto>> {
    const data = await this.userService.getUserStatistics(userId, ownerId);
    return { data };
  }
}
