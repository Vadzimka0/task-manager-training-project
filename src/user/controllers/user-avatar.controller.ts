import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/classes/response-data';
import { ApiOkObjectResponse } from '../../common/decorators';
import {
  AttachmentMessageEnum,
  AvatarMessageEnum,
  MessageEnum,
} from '../../common/enums/messages.enum';
import { getApiParam, isExists } from '../../utils';
import { avatarOptions } from '../../utils/multer/avatar-options';
import { AddAvatarDto, AvatarUploadDto } from '../dto/add-avatar.dto';
import { UserApiDto } from '../dto/user-api.dto';
import { UserEntity } from '../entities/user.entity';
import { UserAvatarService, UserService } from '../services';
import { UserApiType } from '../types';

import type { Response } from 'express';

@ApiTags('Users Avatars:')
@Controller('users-avatar')
@UseGuards(JwtAuthGuard)
export class UserAvatarController {
  constructor(
    private readonly userAvatarService: UserAvatarService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', avatarOptions))
  @ApiOperation({ summary: 'Add Avatar' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvatarUploadDto })
  @ApiOkObjectResponse(UserApiDto)
  @ApiUnprocessableEntityResponse({
    description: `Possible reasons: "${AvatarMessageEnum.AVATAR_COULD_NOT_BE_ATTACHED}"; "${AttachmentMessageEnum.FORMAT_NOT_SUPPORTED}"`,
  })
  async addAvatar(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() addAvatarDto: AddAvatarDto,
  ): Promise<Data<UserApiDto>> {
    const owner = await this.userAvatarService.addAvatar(user, addAvatarDto, file);
    const data = this.userAvatarService.getRequiredFormatUser(owner as UserApiType);
    return { data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download Avatar' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiNotFoundResponse({ description: `"${AttachmentMessageEnum.FILE_NOT_FOUND}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'user'))
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const user = await this.userService.fetchUserById(id);
    const isFileExists = await isExists(user.path);

    if (!isFileExists) {
      throw new NotFoundException(AttachmentMessageEnum.FILE_NOT_FOUND);
    }

    const stream = createReadStream(join(process.cwd(), user.path));
    res.set({
      'Content-Type': user.mimetype,
      'Content-Disposition': `attachment; filename="${user.filename}"`,
    });

    return new StreamableFile(stream);
  }
}
