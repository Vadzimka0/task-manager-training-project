import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MessageEnum } from '../shared/enums/messages.enum';
import PostgresErrorCode from '../database/postgresErrorCode.enum';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { SignUpDto } from './dto';
import { SuccessApiDto, UserInfoApiDto, UserSessionApiDto } from './dto/api-dto';
import { TokenPayload } from './types';

@Injectable()
export class AuthService {
  private token_type: string;

  /**
   * @ignore
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.token_type = 'Bearer';
  }

  /**
   * A method that registers the user in the database and also returns tokens in the required format
   */
  async signUp(signUpDto: SignUpDto): Promise<UserInfoApiDto> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    try {
      const createdUser = await this.userService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });

      const user_session = await this.getUserSessionInfo(createdUser);

      return Object.assign(createdUser, { user_session });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UnprocessableEntityException(MessageEnum.USER_ALREADY_REGISTERED);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * A method that logins the user and returns tokens in the required format
   */
  async signIn(user: UserEntity): Promise<UserSessionApiDto> {
    return this.getUserSessionInfo(user);
  }

  /**
   * A method that updates tokens
   */
  async refreshToken(user: UserEntity): Promise<UserSessionApiDto> {
    return this.getUserSessionInfo(user);
  }

  /**
   * A method that logouts the user
   * @param email An email of user
   */
  async signOut(email: string): Promise<SuccessApiDto> {
    await this.userService.removeRefreshToken(email);

    return { success: true };
  }

  /**
   * A method that returns user session info (tokens) in the required format
   */
  async getUserSessionInfo(user: UserEntity): Promise<UserSessionApiDto> {
    const user_id = user.id;
    const access_token = this.getJwtAccessToken(user.email);
    const refresh_token = this.getJwtRefreshToken(user.email);
    await this.userService.setCurrentRefreshToken(refresh_token, user.id);

    const expiresInMS = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') * 1000;
    const expires_in = new Date(new Date().getTime() + expiresInMS).getTime();

    return { user_id, access_token, refresh_token, token_type: this.token_type, expires_in };
  }

  /**
   * A method that generates JWT access token
   * @param email An email of user
   */
  getJwtAccessToken(email: string) {
    const payload: TokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });

    return token;
  }

  /**
   * A method that generates JWT refresh token
   * @param email An email of user
   */
  getJwtRefreshToken(email: string) {
    const payload: TokenPayload = { email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });

    return refreshToken;
  }

  /**
   * A method that verifies and returns an user
   * @param email An email of user from the request body
   * @param base64Password A password of user the request body
   */
  async getAuthenticatedUser(email: string, base64Password: string) {
    try {
      const user = await this.userService.fetchUserByEmail(email);
      await this.verifyPassword(base64Password, user.password);

      return user;
    } catch (error) {
      throw new UnauthorizedException(MessageEnum.INVALID_CREDENTIALS);
    }
  }

  /**
   * A method that verifies passwords
   * @param base64Password A password of user the request body
   * @param hashedPassword A hashedPassword of user from the database
   */
  private async verifyPassword(base64Password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(base64Password, hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException(MessageEnum.INVALID_CREDENTIALS);
    }
  }
}
