import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateAccesTokenDto } from './dtos/tokens.dto';
import { User } from '@prisma/client';
import { Response as ExpressResponse } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async verifyRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

      if (typeof decoded !== 'object' || !decoded.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userService.findOneById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      // Если произошла ошибка при верификации токена (например, токен просрочен или поврежден)
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async logIn(res: ExpressResponse, user: User) {
    try {
      const tokens = this.genirateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      this.setCokies(res, tokens.refreshToken);

      return tokens.accessToken;
      
    } catch (error) {
      
      throw new UnauthorizedException('Invalid data');
    }
  }

  private genirateTokens(dto: CreateAccesTokenDto) {
    const accessToken = jwt.sign(dto, process.env.ACCESS_SECRET_KEY, {
      expiresIn: process.env.ACCESS_LIMIT,
    });

    const refreshToken = jwt.sign(
      { sub: dto.sub },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_LIMITED,
      },
    );

    return { accessToken, refreshToken };
  }

  private setCokies(res: ExpressResponse, refreshToken: string) {
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}
