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
import { MessageEnum } from '../../common/enums/message.enum';
import { getApiParam } from '../../utils';
import { UserApiDto } from '../dto/user-api.dto';
import { UserStatisticsApiDto } from '../dto/user-statistics-api.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services';

@ApiTags('Users:')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  @ApiOperation({ summary: 'Fetch User' })
  @ApiBearerAuth('access-token')
  @ApiOkObjectResponse(UserApiDto)
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'user'))
  async fetchUser(@Param('id') id: string): Promise<Data<UserApiDto>> {
    const data = await this.userService.fetchUser(id);
    return { data };
  }

  @Get('task-members-search')
  @ApiOperation({ summary: 'Fetch Members By Search Query' })
  @ApiBearerAuth('access-token')
  @ApiOkArrayResponse(UserApiDto)
  @ApiQuery({ name: 'query', example: '?query=Raf' })
  async fetchMembersBySearch(@Query() querySearch: { query: string }): Promise<Data<UserEntity[]>> {
    const data = await this.userService.fetchMembersBySearch(querySearch);
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
  async fetchUserStatistics(
    @User('id') userId: string,
    @Param('ownerId') ownerId: string,
  ): Promise<Data<UserStatisticsApiDto>> {
    const data = await this.userService.fetchUserStatistics(userId, ownerId);
    return { data };
  }
}
