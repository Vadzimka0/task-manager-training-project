import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { SUPPORTED_IMAGES_FORMATS } from '../../common/constants/default-constants';

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
      done(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
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
