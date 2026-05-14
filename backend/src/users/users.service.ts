import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role,
        phone: dto.phone,
      },
    });

    return {
      message: 'Пользователь создан',
      data: this.sanitizeUser(user),
    };
  }

  async findAll(query: UsersQueryDto) {
    const users = await this.prisma.user.findMany({
      where: {
        role: query.role,
        ...(query.query
          ? {
              OR: [
                { fullName: { contains: query.query } },
                { email: { contains: query.query } },
                { phone: { contains: query.query } },
              ],
            }
          : {}),
      },
      include: {
        patient: true,
        doctor: {
          include: { specialization: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: { specialization: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.sanitizeUser(user);
  }

  me(id: number) {
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.ensureExists(id);

    if (dto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email.toLowerCase(),
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        email: dto.email?.toLowerCase(),
        role: dto.role,
        phone: dto.phone,
        ...(dto.password ? { passwordHash: await bcrypt.hash(dto.password, 10) } : {}),
      },
      include: {
        patient: true,
        doctor: {
          include: { specialization: true },
        },
      },
    });

    return {
      message: 'Пользователь обновлён',
      data: this.sanitizeUser(user),
    };
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });

    return {
      message: 'Пользователь удалён',
      data: { id },
    };
  }

  private async ensureExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  private sanitizeUser(user: Record<string, unknown>) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
