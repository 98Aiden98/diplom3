import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email.toLowerCase(),
          passwordHash,
          role: Role.PATIENT,
          phone: dto.phone,
        },
      });

      await tx.patient.create({
        data: {
          userId: createdUser.id,
          fullName: dto.fullName,
          birthDate: dto.birthDate,
          gender: dto.gender,
          phone: dto.phone,
          email: dto.email.toLowerCase(),
          address: dto.address,
          policyNumber: dto.policyNumber,
          passportNumber: dto.passportNumber,
        },
      });

      return createdUser;
    });

    const accessToken = await this.signToken(user);

    return {
      message: 'Регистрация выполнена успешно',
      data: {
        accessToken,
        user: await this.me(user.id),
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        patient: true,
        doctor: {
          include: { specialization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const accessToken = await this.signToken(user);

    return {
      message: 'Вход выполнен успешно',
      data: {
        accessToken,
        user: this.serializeUser(user),
      },
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        doctor: {
          include: { specialization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return this.serializeUser(user);
  }

  private async signToken(user: {
    id: number;
    email: string;
    role: string;
    fullName: string;
  }) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
      fullName: user.fullName,
    });
  }

  private serializeUser(user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    phone: string | null;
    patient?: unknown;
    doctor?: unknown;
  }) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as Role,
      phone: user.phone,
      patient: user.patient ?? null,
      doctor: user.doctor ?? null,
    };
  }
}
