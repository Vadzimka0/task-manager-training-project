import { ApiProperty } from '@nestjs/swagger';

export type Data<T> = {
  data: T;
};

export class ResponseData<T> {
  @ApiProperty()
  data: T;
}
