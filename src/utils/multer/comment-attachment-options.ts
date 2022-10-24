import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { SUPPORTED_IMAGES_FORMATS } from '../../common/constants/default-constants';
import { AttachmentMessageEnum } from '../../common/enums/messages.enum';

export const commentAttachmentOptions: MulterOptions = {
  limits: {
    fileSize: 5242880, // 5MB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    const [type, subtype] = file.mimetype.split('/');
    if (type === 'image' && !SUPPORTED_IMAGES_FORMATS.includes(subtype)) {
      done(new UnprocessableEntityException(AttachmentMessageEnum.FORMAT_NOT_SUPPORTED), false);
    }
    done(null, true);
  },
  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = './uploads/comments-attachments';

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, {
          recursive: true,
        });
      }

      done(null, uploadPath);
    },
    filename(
      req: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      done(null, uuidv4());
    },
  }),
};
