import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Data } from '../common/classes/response-data';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtRefreshGuard, LocalAuthGuard } from './guards';
import { SuccessApiType, UserInfoApiType, UserSessionApiType } from './types';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Data<UserInfoApiType>> {
    const data = await this.authService.signUp(signUpDto);
    return { data };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@User() user: UserEntity): Promise<Data<UserSessionApiType>> {
    const data = await this.authService.signIn(user);
    return { data };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refreshToken(@User() user: UserEntity): Promise<Data<UserSessionApiType>> {
    const data = await this.authService.refreshToken(user);
    return { data };
  }

  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Body() body: { email: string }): Promise<Data<SuccessApiType>> {
    const data = await this.authService.signOut(body.email);
    return { data };
  }
}
