import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser, UpdateUser } from './dtos/create-user.dto';
import { AccessGuard } from 'src/auth/guards/tokens.guard';

@UseGuards(AccessGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id/:id')
  async findOne(@Param('id') userId: string) {
    return await this.userService.findOneById(userId);
  }

  @Post()
  async createUser(@Body() dto: CreateUser) {
    const findUser = await this.userService.findOneByEmail(dto.email);

    if (findUser) {
      throw new ConflictException('User with this email already exists');
    }

    return await this.userService.createOne(dto);
  }
  
  @Put('id/:id')
  async updateUser(@Param('id') userId: string, @Body() dto: UpdateUser) {
    return await this.userService.updateOne(userId, dto);
  }
  
  @Delete('id/:id')
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.deleteOne(userId);
  }
  
  
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }
}
