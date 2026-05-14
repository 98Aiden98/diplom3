import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    await this.ensureSpecialization(dto.specializationId);

    const exists = await this.prisma.medicalService.findFirst({
      where: {
        name: dto.name,
        specializationId: dto.specializationId,
      },
    });

    if (exists) {
      throw new ConflictException('Услуга для этой специальности уже существует');
    }

    const service = await this.prisma.medicalService.create({
      data: dto,
      include: { specialization: true },
    });

    return {
      message: 'Медицинская услуга создана',
      data: service,
    };
  }

  findAll() {
    return this.prisma.medicalService.findMany({
      include: { specialization: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.medicalService.findUnique({
      where: { id },
      include: { specialization: true },
    });

    if (!service) {
      throw new NotFoundException('Медицинская услуга не найдена');
    }

    return service;
  }

  async update(id: number, dto: UpdateServiceDto) {
    const existing = await this.findOne(id);
    if (dto.specializationId) {
      await this.ensureSpecialization(dto.specializationId);
    }

    if (dto.name || dto.specializationId) {
      const duplicate = await this.prisma.medicalService.findFirst({
        where: {
          name: dto.name ?? existing.name,
          specializationId: dto.specializationId ?? existing.specializationId,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException('Услуга для этой специальности уже существует');
      }
    }

    const service = await this.prisma.medicalService.update({
      where: { id },
      data: dto,
      include: { specialization: true },
    });

    return {
      message: 'Медицинская услуга обновлена',
      data: service,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.medicalService.delete({ where: { id } });

    return {
      message: 'Медицинская услуга удалена',
      data: { id },
    };
  }

  async getBySpecialization(specializationId: number) {
    await this.ensureSpecialization(specializationId);

    return this.prisma.medicalService.findMany({
      where: { specializationId },
      include: { specialization: true },
      orderBy: { name: 'asc' },
    });
  }

  private async ensureSpecialization(id: number) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException('Специальность не найдена');
    }
  }
}
