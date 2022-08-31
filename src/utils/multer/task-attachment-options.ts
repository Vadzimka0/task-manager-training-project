import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const taskAttachmentOptions: MulterOptions = {
  limits: {
    fileSize: 5242880, // 5MB
  },
  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const uploadPath = './uploads/tasks-attachments';

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
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
