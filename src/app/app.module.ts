import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
