import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Data } from '../common/types/data';
import { UserService } from '../user/services/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard, LocalAuthGuard } from './guards';
import { Register } from './interfaces/register.type';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { SuccessResponse } from './interfaces/successResponse.interface';
import { UserSession } from './interfaces/userSession.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('sign-up')
  async register(@Body() registerDto: RegisterDto): Promise<Data<Register>> {
    const data = await this.authService.register(registerDto);
    return { data };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async logIn(@Req() request: RequestWithUser): Promise<Data<UserSession>> {
    const data = await this.authService.login(request.user);
    return { data };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refresh(@Req() request: RequestWithUser): Promise<Data<UserSession>> {
    const data = await this.authService.refresh(request.user);
    return { data };
  }

  @HttpCode(200)
  @Post('sign-out')
  async logOut(@Body() body: { email: string }): Promise<Data<SuccessResponse>> {
    const data = await this.authService.logout(body.email);
    return { data };
  }
}
