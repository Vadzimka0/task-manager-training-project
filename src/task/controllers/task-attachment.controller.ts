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
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

import { JwtAuthGuard } from '../../auth/guards';
import { Data } from '../../shared/classes/response-data';
import { ApiOkObjectResponse } from '../../shared/decorators';
import { AttachmentMessageEnum, MessageEnum } from '../../shared/enums/messages.enum';
import { taskAttachmentOptions } from '../../shared/multer/task-attachment-options';
import { UtilsService } from '../../shared/services/utils.service';
import { getApiParam } from '../../shared/swagger-utils/getApiParam';
import { AddTaskAttachmentDto } from '../dto';
import { FileUploadDto } from '../dto/add-task-attachment.dto';
import { TaskAttachmentApiDto } from '../dto/api-dto/task-attachment-api.dto';
import { TaskAttachmentService } from '../services';

import type { Response } from 'express';

@ApiTags('Tasks Attachments:')
@Controller('tasks-attachments')
@UseGuards(JwtAuthGuard)
export class TaskAttachmentController {
  constructor(
    private readonly taskAttachmentService: TaskAttachmentService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', taskAttachmentOptions))
  @ApiOperation({ summary: 'Add New Task Attachment' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiOkObjectResponse(TaskAttachmentApiDto)
  @ApiForbiddenResponse({ description: `"${MessageEnum.INVALID_ID_NOT_OWNER}"` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  async addTaskAttachment(
    @UploadedFile() file: Express.Multer.File,
    @Body() addTaskAttachmentDto: AddTaskAttachmentDto,
  ): Promise<Data<TaskAttachmentApiDto>> {
    const attachment = await this.taskAttachmentService.addTaskAttachment(
      addTaskAttachmentDto,
      file,
    );
    const data = this.taskAttachmentService.getRequiredFormatTaskAttachment(
      attachment as TaskAttachmentApiDto,
    );
    return { data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download Task Attachment' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiNotFoundResponse({ description: `"${AttachmentMessageEnum.FILE_NOT_FOUND}";` })
  @ApiInternalServerErrorResponse({ description: `"${MessageEnum.ENTITY_NOT_FOUND}";` })
  @ApiParam(getApiParam('id', 'task attachment'))
  async getDatabaseFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.taskAttachmentService.fetchFileById(id);
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
