import { ApiProperty } from '@nestjs/swagger';

export type Data<T> = {
  data: T;
};

export class ResponseD<T> {
  @ApiProperty()
  data: T;
}
