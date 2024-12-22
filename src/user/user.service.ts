import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUser, UpdateUser } from './dtos/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    const findUser = await this.prisma.user.findUnique({ where: { id: id } });

    if (!findUser) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return findUser;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email: email } });
  }

  async createOne(dto: CreateUser) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        hashedPassword: hashedPassword,
      },
    });
  }

  async updateOne(id: string, dto: UpdateUser) {
    await this.findOneById(id);

    // Если обновляем мейл
    if (dto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`Email "${dto.email}" is already in use.`);
      }
    }

    const data = {
      ...dto,
      hashedPassword: dto.password
        ? await bcrypt.hash(dto.password, 10)
        : undefined,
    };

    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key],
    );

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteOne(id:string) {
    await this.findOneById(id);
    
    return this.prisma.user.delete({ where: { id } });
  }
  
  
  async getAll() {
    return await this.prisma.user.findMany();
  }
}
