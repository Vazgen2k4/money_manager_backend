import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAccessStrategy } from 'src/auth/strateges/jwt_access.strategy';
import { JwtRefreshStrategy } from 'src/auth/strateges/jwt_refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController, UserController, AuthController],
  providers: [
    AuthService,
    AppService,
    UserService,
    PrismaService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AppModule {}
