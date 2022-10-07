import { ApiProperty, OmitType } from '@nestjs/swagger';

import { UserApiDto } from '../../../user/dto/user-api.dto';
import { UserSessionApiDto } from './user-session-api.dto';

export class UserInfoApiDto extends OmitType(UserApiDto, ['created_at'] as const) {
  @ApiProperty()
  user_session: UserSessionApiDto;
}
