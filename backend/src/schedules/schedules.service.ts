import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { rangesOverlap, timeToMinutes } from '../common/utils/time.util';
import { PrismaService } from '../database/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.doctorSchedule.findMany({
      include: {
        doctor: {
          include: { specialization: true },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async create(dto: CreateScheduleDto) {
    await this.ensureDoctor(dto.doctorId);
    await this.validateRange(dto.doctorId, dto.dayOfWeek, dto.startTime, dto.endTime);

    const schedule = await this.prisma.doctorSchedule.create({
      data: {
        doctorId: dto.doctorId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        cabinetNumber: dto.cabinetNumber,
        isActive: dto.isActive ?? true,
      },
      include: {
        doctor: {
          include: { specialization: true },
        },
      },
    });

    return {
      message: 'Расписание создано',
      data: schedule,
    };
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const existing = await this.prisma.doctorSchedule.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Расписание не найдено');
    }

    const doctorId = dto.doctorId ?? existing.doctorId;
    const dayOfWeek = dto.dayOfWeek ?? existing.dayOfWeek;
    const startTime = dto.startTime ?? existing.startTime;
    const endTime = dto.endTime ?? existing.endTime;

    await this.ensureDoctor(doctorId);
    await this.validateRange(doctorId, dayOfWeek, startTime, endTime, id);

    const schedule = await this.prisma.doctorSchedule.update({
      where: { id },
      data: {
        doctorId,
        dayOfWeek,
        startTime,
        endTime,
        cabinetNumber: dto.cabinetNumber,
        isActive: dto.isActive,
      },
      include: {
        doctor: {
          include: { specialization: true },
        },
      },
    });

    return {
      message: 'Расписание обновлено',
      data: schedule,
    };
  }

  async remove(id: number) {
    const schedule = await this.prisma.doctorSchedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('Расписание не найдено');
    }

    await this.prisma.doctorSchedule.delete({ where: { id } });

    return {
      message: 'Расписание удалено',
      data: { id },
    };
  }

  async getDoctorSchedules(doctorId: number) {
    await this.ensureDoctor(doctorId);
    return this.prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  private async validateRange(
    doctorId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ) {
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      throw new ConflictException('Время начала должно быть раньше времени окончания');
    }

    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        dayOfWeek,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    const overlapping = schedules.find((schedule) =>
      rangesOverlap(schedule.startTime, schedule.endTime, startTime, endTime),
    );

    if (overlapping) {
      throw new ConflictException('Расписание пересекается с уже существующим интервалом');
    }
  }

  private async ensureDoctor(doctorId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Врач не найден');
    }
  }
}
