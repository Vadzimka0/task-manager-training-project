import {
  Body,
  ClassSerializerInterceptor,
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
import { createReadStream } from 'fs';
import { join } from 'path';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { isExists } from '../../utils';
import { avatarOptions } from '../../utils/multer/avatar-options';
import { UserEntity } from '../entities/user.entity';
import { UserAvatarService, UserService } from '../services';
import { UserApiType } from '../types';

import type { Response } from 'express';

@Controller('users-avatar')
@UseInterceptors(ClassSerializerInterceptor)
export class UserAvatarController {
  constructor(
    private readonly userAvatarService: UserAvatarService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', avatarOptions))
  async addTaskAttachment(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() addAvatarDto: { user_id: string },
  ): Promise<Data<UserApiType>> {
    const data = await this.userAvatarService.addAvatar(user, addAvatarDto, file);
    return { data };
  }

  @Get(':id')
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const user = await this.userService.getById(id);
    const isFileExists = await isExists(user.path);

    if (!isFileExists) {
      throw new NotFoundException(`sorry, file ${user.filename} not found`);
    }

    const stream = createReadStream(join(process.cwd(), user.path));

    res.set({
      'Content-Type': user.mimetype,
      'Content-Disposition': `attachment; filename="${user.filename}"`,
    });

    return new StreamableFile(stream);
  }
}
