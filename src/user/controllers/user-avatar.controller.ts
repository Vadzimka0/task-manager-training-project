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
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { User } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../common/types/data';
import { isExists } from '../../utils';
import { avatarOptions } from '../../utils/multer/avatar-options';
import { UserEntity } from '../entities/user.entity';
import { UserAvatarService } from '../services/user-avatar.service';

import type { Response } from 'express';

@Controller('users-avatar')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserAvatarController {
  private server_url: string;
  constructor(
    private readonly userAvatarService: UserAvatarService,
    private readonly configService: ConfigService,
  ) {
    this.server_url = `${this.configService.get('URL_HOST')}:${this.configService.get(
      'URL_PORT',
    )}/${this.configService.get('URL_PREFIX_PATH')}/`;
  }

  @HttpCode(200)
  @Post()
  @UseInterceptors(FileInterceptor('file', avatarOptions))
  async addTaskAttachment(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() addAvatarDto: { user_id: string },
  ): Promise<Data<UserEntity>> {
    const data = await this.userAvatarService.addAvatar(user, addAvatarDto.user_id, {
      avatar_url: `${this.server_url}${file.path.substring(file.path.indexOf('/') + 1)}`,
      mimetype: file.mimetype,
      path: file.path,
      filename: file.originalname,
    });
    return { data };
  }

  @Get(':id')
  async getDatabaseFile(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // check id's matching

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
