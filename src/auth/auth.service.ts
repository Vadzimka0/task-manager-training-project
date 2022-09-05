import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import PostgresErrorCode from '../database/postgresErrorCode.enum';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { RegisterDto } from './dto/register.dto';
import { Register } from './interfaces/register.type';
import { SuccessResponse } from './interfaces/successResponse.interface';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { UserSession } from './interfaces/userSession.interface';

@Injectable()
export class AuthService {
  private token_type: string;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.token_type = 'Bearer';
  }

  async register(registerDto: RegisterDto): Promise<Register> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      const createdUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });
      delete createdUser.refresh_token;
      delete createdUser.password;

      const user_session = await this.getUserSessionInfo(createdUser);
      return { ...createdUser, user_session };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UnprocessableEntityException('User is already registered.');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(user: UserEntity): Promise<UserSession> {
    return this.getUserSessionInfo(user);
  }

  async refresh(user: UserEntity): Promise<UserSession> {
    return this.getUserSessionInfo(user);
  }

  async logout(email: string): Promise<SuccessResponse> {
    await this.userService.removeRefreshToken(email);
    return { success: true };
  }

  async getUserSessionInfo(user: UserEntity): Promise<UserSession> {
    const access_token = this.getJwtAccessToken(user.email);
    const refresh_token = this.getJwtRefreshToken(user.email);
    await this.userService.setCurrentRefreshToken(refresh_token, user.id);

    const expiresInMS = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') * 1000;
    const expires_in = new Date(new Date().getTime() + expiresInMS).getTime();
    return { access_token, refresh_token, token_type: this.token_type, expires_in };
  }

  getJwtAccessToken(email: string) {
    const payload: TokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
    return token;
  }

  getJwtRefreshToken(email: string) {
    const payload: TokenPayload = { email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    return refreshToken;
  }

  async getAuthenticatedUser(email: string, base64Password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(base64Password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  private async verifyPassword(base64Password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(base64Password, hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
