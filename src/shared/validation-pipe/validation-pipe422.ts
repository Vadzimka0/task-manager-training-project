import {
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export class ValidationPipe422 extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(e.getResponse());
      }
    }
  }
}
