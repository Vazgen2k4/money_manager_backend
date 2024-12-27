import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/login.dto';
import { UserService } from 'src/user/user.service';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import * as argon2 from 'argon2';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('login')
  async logIn(@Response() res: ExpressResponse, @Body() dto: LogInDto) {
    const userByEmail = await this.usersService.findOneByEmailWithThrow(
      dto.email,
    );

    let isValidPassword = await argon2.verify(
      userByEmail.hashedPassword,
      dto.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = await this.authService.logIn(res, userByEmail);

    res.send({
      accessToken: accessToken,
    });
  }

  @Post('refresh')
  async refresh(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const user = await this.authService.verifyRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.authService.logIn(res, user);

    res.send({
      accessToken: accessToken,
    });
  }
  
  
  @Post('logout')
  async logout(@Response() res: ExpressResponse) {
    res.clearCookie('refresh-token');
    res.sendStatus(200);
  }
}
