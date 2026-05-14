import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpecializationDto) {
    const exists = await this.prisma.specialization.findUnique({
      where: { name: dto.name },
    });
    if (exists) {
      throw new ConflictException('Такая специальность уже существует');
    }

    const specialization = await this.prisma.specialization.create({ data: dto });
    return {
      message: 'Специальность создана',
      data: specialization,
    };
  }

  findAll() {
    return this.prisma.specialization.findMany({
      include: {
        doctors: true,
        services: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const specialization = await this.prisma.specialization.findUnique({
      where: { id },
      include: {
        doctors: true,
        services: true,
      },
    });

    if (!specialization) {
      throw new NotFoundException('Специальность не найдена');
    }

    return specialization;
  }

  async update(id: number, dto: UpdateSpecializationDto) {
    await this.findOne(id);
    if (dto.name) {
      const exists = await this.prisma.specialization.findFirst({
        where: {
          name: dto.name,
          NOT: { id },
        },
      });
      if (exists) {
        throw new ConflictException('Такая специальность уже существует');
      }
    }

    const specialization = await this.prisma.specialization.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Специальность обновлена',
      data: specialization,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.specialization.delete({ where: { id } });

    return {
      message: 'Специальность удалена',
      data: { id },
    };
  }
}
