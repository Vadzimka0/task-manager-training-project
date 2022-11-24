import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

import { ExpressRequestType } from '../../auth/types';
import { AttachmentMessageEnum } from '../../common/enums/messages.enum';

export const avatarOptions: MulterOptions = {
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    console.log(file.mimetype);
    if (file.mimetype.match(/\/(jpg|jpeg|png|octet-stream)$/)) {
      done(null, true);
    } else {
      done(new UnprocessableEntityException(AttachmentMessageEnum.FORMAT_NOT_SUPPORTED), false);
    }
  },
  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = './uploads/users-avatar';

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, {
          recursive: true,
        });
      }

      done(null, uploadPath);
    },
    filename(
      req: ExpressRequestType,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      done(null, req.user.id);
    },
  }),
};
