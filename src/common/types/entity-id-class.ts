import { ApiProperty } from '@nestjs/swagger';

export class EntityId {
  @ApiProperty({
    description: 'entity id',
    example: 'd091f63d-157f-4835-9038-e33d3e996fb7',
  })
  id: string;
}
