import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Role } from '../common/enums/role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsQueryDto } from './dto/doctors-query.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDoctorDto, photoUrl?: string) {
    await this.ensureSpecialization(dto.specializationId);
    const user = await this.resolveOrCreateDoctorUser(dto);

    const doctor = await this.prisma.doctor.create({
      data: {
        userId: user.id,
        fullName: dto.fullName,
        specializationId: dto.specializationId,
        phone: dto.phone,
        email: dto.email.toLowerCase(),
        photoUrl,
        cabinetNumber: dto.cabinetNumber,
        experienceYears: dto.experienceYears,
        description: dto.description,
      },
      include: {
        user: true,
        specialization: true,
      },
    });

    return {
      message: 'Врач создан',
      data: doctor,
    };
  }

  async findAll(query: DoctorsQueryDto) {
    return this.prisma.doctor.findMany({
      where: {
        specializationId: query.specializationId,
        ...(query.query
          ? {
              OR: [
                { fullName: { contains: query.query } },
                { email: { contains: query.query } },
                {
                  specialization: {
                    name: { contains: query.query },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        specialization: true,
        user: true,
        schedules: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        specialization: true,
        user: true,
        schedules: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Врач не найден');
    }

    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto, photoUrl?: string) {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingDoctor) {
      throw new NotFoundException('Врач не найден');
    }

    if (dto.specializationId) {
      await this.ensureSpecialization(dto.specializationId);
    }

    if (dto.email) {
      const emailOwner = await this.prisma.user.findFirst({
        where: {
          email: dto.email.toLowerCase(),
          NOT: { id: existingDoctor.userId },
        },
      });

      if (emailOwner) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    const doctor = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingDoctor.userId },
        data: {
          fullName: dto.fullName,
          email: dto.email?.toLowerCase(),
          phone: dto.phone,
          ...(dto.password ? { passwordHash: await bcrypt.hash(dto.password, 10) } : {}),
        },
      });

      return tx.doctor.update({
        where: { id },
        data: {
          fullName: dto.fullName,
          specializationId: dto.specializationId,
          phone: dto.phone,
          email: dto.email?.toLowerCase(),
          ...(photoUrl ? { photoUrl } : {}),
          cabinetNumber: dto.cabinetNumber,
          experienceYears: dto.experienceYears,
          description: dto.description,
        },
        include: {
          specialization: true,
          user: true,
          schedules: true,
        },
      });
    });

    if (photoUrl && existingDoctor.photoUrl && existingDoctor.photoUrl !== photoUrl) {
      this.deletePhoto(existingDoctor.photoUrl);
    }

    return {
      message: 'Профиль врача обновлён',
      data: doctor,
    };
  }

  async remove(id: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Врач не найден');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.doctor.delete({ where: { id } });
      await tx.user.delete({ where: { id: doctor.userId } });
    });

    this.deletePhoto(doctor.photoUrl);

    return {
      message: 'Врач удалён',
      data: { id },
    };
  }

  async getBySpecialization(specializationId: number) {
    await this.ensureSpecialization(specializationId);

    return this.prisma.doctor.findMany({
      where: { specializationId },
      include: {
        specialization: true,
        schedules: { where: { isActive: true } },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async getSchedule(id: number) {
    await this.ensureExists(id);

    return this.prisma.doctorSchedule.findMany({
      where: { doctorId: id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAppointments(id: number, user: RequestUser) {
    if (user.role === Role.DOCTOR) {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId: user.id } });
      if (!doctor || doctor.id !== id) {
        throw new ForbiddenException('Врач может просматривать только свои приёмы');
      }
    }

    await this.ensureExists(id);

    return this.prisma.appointment.findMany({
      where: { doctorId: id },
      include: {
        patient: true,
        service: true,
        medicalRecord: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  private async resolveOrCreateDoctorUser(dto: CreateDoctorDto) {
    if (dto.userId) {
      const existingUser = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!existingUser) {
        throw new NotFoundException('Связанный пользователь не найден');
      }
      return existingUser;
    }

    if (!dto.password) {
      throw new BadRequestException('Для нового врача необходимо указать пароль');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        role: Role.DOCTOR,
        passwordHash: await bcrypt.hash(dto.password, 10),
      },
    });
  }

  private async ensureSpecialization(id: number) {
    const specialization = await this.prisma.specialization.findUnique({ where: { id } });
    if (!specialization) {
      throw new NotFoundException('Специальность не найдена');
    }
  }

  private async ensureExists(id: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Врач не найден');
    }
  }

  private deletePhoto(photoUrl?: string | null) {
    if (!photoUrl) {
      return;
    }

    if (photoUrl.endsWith('.svg')) {
      return;
    }

    const normalizedPath = photoUrl.replace(/^\//, '');
    const absolutePath = join(process.cwd(), normalizedPath);

    if (existsSync(absolutePath)) {
      unlinkSync(absolutePath);
    }
  }
}
