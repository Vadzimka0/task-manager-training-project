import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    return user;
  }
}
