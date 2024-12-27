import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUser, UpdateUser } from './dtos/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    const findUser = await this.prisma.user.findUnique({ where: { id } });

    if (!findUser) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return findUser;
  }

  async findOneByEmailWithThrow(email: string) {
    const findUser = this.findOneByEmail(email);
    
    if (!findUser) {
      throw new NotFoundException(`User with Email '${email}' not found.`);
    }

    return findUser;
  }

  async findOneByEmail(email: string) {
    const findUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return findUser;
  }

  async createOne(dto: CreateUser) {
    const hashedPassword = await argon2.hash(dto.password);

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

    // TODO: Переделать логику и добвить кейс для смены парроля
    const data = {
      ...dto,
      hashedPassword: dto.password
        ? await argon2.hash(dto.password)
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

  async deleteOne(id: string) {
    await this.findOneById(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }
}
