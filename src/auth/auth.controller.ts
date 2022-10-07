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
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { Data } from '../common/classes/response-data';
import { ApiObjectResponse, ApiOkObjectResponse } from '../common/decorators';
import { MessageEnum } from '../common/enums/messages.enum';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { RefreshTokenDto, SignInDto, SignOutDto, SignUpDto } from './dto';
import { SuccessApiDto, UserInfoApiDto, UserSessionApiDto } from './dto/api-dto';
import { JwtRefreshGuard, LocalAuthGuard } from './guards';

@ApiTags('Auth:')
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Registration' })
  @ApiObjectResponse(201, UserInfoApiDto)
  @ApiUnprocessableEntityResponse({ description: `"${MessageEnum.USER_ALREADY_REGISTERED}";` })
  async signUp(@Body() signUpDto: SignUpDto): Promise<Data<UserInfoApiDto>> {
    const data = await this.authService.signUp(signUpDto);
    return { data };
  }

  @Post('sign-in')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Loginization' })
  @ApiBody({ type: SignInDto })
  @ApiOkObjectResponse(UserSessionApiDto)
  @ApiUnauthorizedResponse({ description: `"${MessageEnum.INVALID_CREDENTIALS}";` })
  async signIn(@User() user: UserEntity): Promise<Data<UserSessionApiDto>> {
    const data = await this.authService.signIn(user);
    return { data };
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update Tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkObjectResponse(UserSessionApiDto)
  @ApiUnauthorizedResponse({ description: `"${MessageEnum.INVALID_REFRESH_TOKEN}";` })
  async refreshToken(@User() user: UserEntity): Promise<Data<UserSessionApiDto>> {
    const data = await this.authService.refreshToken(user);
    return { data };
  }

  @Post('sign-out')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log Out' })
  @ApiOkObjectResponse(SuccessApiDto)
  async signOut(@Body() body: SignOutDto): Promise<Data<SuccessApiDto>> {
    const data = await this.authService.signOut(body.email);
    return { data };
  }
}
