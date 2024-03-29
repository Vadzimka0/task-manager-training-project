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
  ApiForbiddenResponse,
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
import { Data } from '../../shared/classes/response-data';
import { ApiOkObjectResponse } from '../../shared/decorators';
import { AttachmentMessageEnum, MessageEnum } from '../../shared/enums/messages.enum';
import { commentAttachmentOptions } from '../../shared/multer/comment-attachment-options';
import { UtilsService } from '../../shared/services/utils.service';
import { getApiParam } from '../../shared/swagger-utils/getApiParam';
import { AddCommentAttachmentDto } from '../dto';
import { CommentFileUploadDto } from '../dto/add-comment-attachment.dto';
import { CommentAttachmentApiDto } from '../dto/api-dto/comment-attachment-api.dto';
import { CommentAttachmentService } from '../services';

import type { Response } from 'express';

@ApiTags('Comments Attachments:')
@Controller('comments-attachments')
@UseGuards(JwtAuthGuard)
export class CommentAttachmentController {
  constructor(
    private readonly commentAttachmentService: CommentAttachmentService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', commentAttachmentOptions))
  @ApiOperation({ summary: 'Add New Comment Attachment' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CommentFileUploadDto })
  @ApiOkObjectResponse(CommentAttachmentApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiUnprocessableEntityResponse({
    description: `"${AttachmentMessageEnum.FORMAT_NOT_SUPPORTED}"`,
  })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  async addCommentAttachment(
    @User('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() addCommentAttachmentDto: AddCommentAttachmentDto,
  ): Promise<Data<CommentAttachmentApiDto>> {
    const attachment = await this.commentAttachmentService.addCommentAttachment(
      userId,
      addCommentAttachmentDto,
      file,
    );
    const data = this.commentAttachmentService.getRequiredFormatCommentAttachment(
      attachment as CommentAttachmentApiDto,
    );
    return { data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download Comment Attachment' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiNotFoundResponse({ description: `"${AttachmentMessageEnum.FILE_NOT_FOUND}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'comment attachment'))
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.commentAttachmentService.fetchFileById(id);
    const isFileExists = await this.utilsService.isExists(file.path);

    if (!isFileExists) {
      throw new NotFoundException(AttachmentMessageEnum.FILE_NOT_FOUND);
    }

    const stream = createReadStream(join(process.cwd(), file.path));
    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });

    return new StreamableFile(stream);
  }
}
