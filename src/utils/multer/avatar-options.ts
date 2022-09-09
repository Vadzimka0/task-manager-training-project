import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ExpressRequestInterface } from '../../auth/types';

export const avatarOptions: MulterOptions = {
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      done(null, true);
    } else {
      done(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
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
      req: ExpressRequestInterface,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      done(null, req.user.id);
    },
  }),
};
