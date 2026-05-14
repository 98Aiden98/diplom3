import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { Role } from '../common/enums/role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import {
  getDayOfWeek,
  minutesToTime,
  rangesOverlap,
  timeToMinutes,
} from '../common/utils/time.util';
import { PrismaService } from '../database/prisma.service';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, user: RequestUser) {
    const patientId = await this.resolvePatientId(user, dto.patientId);
    const doctor = await this.ensureDoctor(dto.doctorId);
    const service = await this.ensureService(dto.serviceId);

    const endTime = minutesToTime(timeToMinutes(dto.startTime) + service.durationMinutes);

    if (doctor.specializationId !== service.specializationId) {
      throw new BadRequestException('Выбранная услуга не относится к специальности врача');
    }

    await this.ensurePatient(patientId);
    await this.ensureDoctorAvailability(doctor.id, dto.date, dto.startTime, endTime);
    await this.ensurePatientAvailability(patientId, dto.date, dto.startTime, endTime);

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctor.id,
        serviceId: service.id,
        date: dto.date,
        startTime: dto.startTime,
        endTime,
        reason: dto.reason,
        comment: dto.comment,
      },
      include: this.includeShape(),
    });

    return {
      message: 'Запись на приём создана',
      data: appointment,
    };
  }

  async findAll(query: AppointmentsQueryDto, user: RequestUser) {
    const where: Record<string, unknown> = {
      ...(query.doctorId ? { doctorId: query.doctorId } : {}),
      ...(query.patientId ? { patientId: query.patientId } : {}),
      ...(query.date ? { date: query.date } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    if (user.role === Role.PATIENT) {
      where.patientId = await this.getPatientIdByUser(user.id);
    }

    if (user.role === Role.DOCTOR) {
      where.doctorId = await this.getDoctorIdByUser(user.id);
    }

    return this.prisma.appointment.findMany({
      where,
      include: this.includeShape(),
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(id: number, user: RequestUser) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: this.includeShape(),
    });

    if (!appointment) {
      throw new NotFoundException('Запись на приём не найдена');
    }

    await this.ensureAccess(user, appointment.patientId, appointment.doctorId);
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    const existing = await this.prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Запись на приём не найдена');
    }

    const patientId = dto.patientId ?? existing.patientId;
    const doctorId = dto.doctorId ?? existing.doctorId;
    const serviceId = dto.serviceId ?? existing.serviceId;
    const date = dto.date ?? existing.date;
    const startTime = dto.startTime ?? existing.startTime;

    const doctor = await this.ensureDoctor(doctorId);
    const service = await this.ensureService(serviceId);
    const endTime = minutesToTime(timeToMinutes(startTime) + service.durationMinutes);

    if (doctor.specializationId !== service.specializationId) {
      throw new BadRequestException('Выбранная услуга не относится к специальности врача');
    }

    await this.ensurePatient(patientId);
    await this.ensureDoctorAvailability(doctorId, date, startTime, endTime, id);
    await this.ensurePatientAvailability(patientId, date, startTime, endTime, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        patientId,
        doctorId,
        serviceId,
        date,
        startTime,
        endTime,
        status: dto.status,
        reason: dto.reason,
        comment: dto.comment,
      },
      include: this.includeShape(),
    });

    return {
      message: 'Запись на приём обновлена',
      data: appointment,
    };
  }

  async remove(id: number) {
    await this.findExisting(id);
    await this.prisma.appointment.delete({ where: { id } });

    return {
      message: 'Запись на приём удалена',
      data: { id },
    };
  }

  async cancel(id: number, user: RequestUser) {
    const appointment = await this.findExisting(id);
    await this.ensureAccess(user, appointment.patientId, appointment.doctorId, true);

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
      include: this.includeShape(),
    });

    return {
      message: 'Запись на приём отменена',
      data: updated,
    };
  }

  async complete(id: number, user: RequestUser) {
    const appointment = await this.findExisting(id);
    await this.ensureCompletionAccess(user, appointment.doctorId);

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.COMPLETED },
      include: this.includeShape(),
    });

    return {
      message: 'Приём завершён',
      data: updated,
    };
  }

  async getByPatient(patientId: number, user: RequestUser) {
    await this.ensurePatientAccess(user, patientId);
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: this.includeShape(),
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    });
  }

  async getByDoctor(doctorId: number, user: RequestUser) {
    await this.ensureDoctorAccess(user, doctorId);
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: this.includeShape(),
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAvailableSlots(query: AvailableSlotsQueryDto) {
    const doctor = await this.ensureDoctor(query.doctorId);
    const duration = query.serviceId
      ? (await this.ensureService(query.serviceId)).durationMinutes
      : 30;

    const dayOfWeek = getDayOfWeek(query.date);
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId: doctor.id,
        dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    });

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        date: query.date,
        status: { not: AppointmentStatus.CANCELLED },
      },
    });

    const slots: Array<{ startTime: string; endTime: string }> = [];

    for (const schedule of schedules) {
      for (
        let current = timeToMinutes(schedule.startTime);
        current + duration <= timeToMinutes(schedule.endTime);
        current += duration
      ) {
        const startTime = minutesToTime(current);
        const endTime = minutesToTime(current + duration);
        const hasConflict = appointments.some((appointment) =>
          rangesOverlap(appointment.startTime, appointment.endTime, startTime, endTime),
        );

        if (!hasConflict) {
          slots.push({ startTime, endTime });
        }
      }
    }

    return slots;
  }

  private includeShape() {
    return {
      patient: true,
      doctor: {
        include: {
          specialization: true,
        },
      },
      service: {
        include: {
          specialization: true,
        },
      },
      medicalRecord: true,
    };
  }

  private async ensureDoctorAvailability(
    doctorId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: number,
  ) {
    const dayOfWeek = getDayOfWeek(date);
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        dayOfWeek,
        isActive: true,
      },
    });

    const fitsSchedule = schedules.some(
      (schedule) =>
        timeToMinutes(startTime) >= timeToMinutes(schedule.startTime) &&
        timeToMinutes(endTime) <= timeToMinutes(schedule.endTime),
    );

    if (!fitsSchedule) {
      throw new ConflictException('Выбранное время выходит за пределы расписания врача');
    }

    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        status: { not: AppointmentStatus.CANCELLED },
        ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
      },
    });

    if (
      conflictingAppointment &&
      rangesOverlap(
        conflictingAppointment.startTime,
        conflictingAppointment.endTime,
        startTime,
        endTime,
      )
    ) {
      throw new ConflictException('Выбранный слот уже занят у врача');
    }
  }

  private async ensurePatientAvailability(
    patientId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: number,
  ) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId,
        date,
        status: { not: AppointmentStatus.CANCELLED },
        ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
      },
    });

    const conflict = appointments.find((appointment) =>
      rangesOverlap(appointment.startTime, appointment.endTime, startTime, endTime),
    );

    if (conflict) {
      throw new ConflictException('У пациента уже есть запись на это время');
    }
  }

  private async resolvePatientId(user: RequestUser, patientId?: number) {
    if (user.role === Role.PATIENT) {
      return this.getPatientIdByUser(user.id);
    }

    if (!patientId) {
      throw new BadRequestException('Не указан пациент для записи');
    }

    return patientId;
  }

  private async getPatientIdByUser(userId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new ForbiddenException('Профиль пациента не найден');
    }
    return patient.id;
  }

  private async getDoctorIdByUser(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      throw new ForbiddenException('Профиль врача не найден');
    }
    return doctor.id;
  }

  private async ensureDoctorAccess(user: RequestUser, doctorId: number) {
    if ([Role.ADMIN, Role.REGISTRAR].includes(user.role)) {
      return;
    }

    if (user.role === Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
      return;
    }

    throw new ForbiddenException('Доступ запрещён');
  }

  private async ensurePatientAccess(user: RequestUser, patientId: number) {
    if ([Role.ADMIN, Role.REGISTRAR].includes(user.role)) {
      return;
    }

    if (user.role === Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
      return;
    }

    if (user.role === Role.DOCTOR) {
      const doctorId = await this.getDoctorIdByUser(user.id);
      const relation = await this.prisma.appointment.findFirst({
        where: { doctorId, patientId },
      });

      if (relation) {
        return;
      }
    }

    throw new ForbiddenException('Доступ запрещён');
  }

  private async ensureCompletionAccess(user: RequestUser, doctorId: number) {
    if (user.role === Role.ADMIN) {
      return;
    }

    if (user.role === Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
      return;
    }

    throw new ForbiddenException('Завершить приём может только назначенный врач');
  }

  private async ensureAccess(
    user: RequestUser,
    patientId: number,
    doctorId: number,
    allowPatientCancel = false,
  ) {
    if ([Role.ADMIN, Role.REGISTRAR].includes(user.role)) {
      return;
    }

    if (user.role === Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
      return;
    }

    if (
      user.role === Role.PATIENT &&
      allowPatientCancel &&
      (await this.getPatientIdByUser(user.id)) === patientId
    ) {
      return;
    }

    if (user.role === Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
      return;
    }

    throw new ForbiddenException('Доступ запрещён');
  }

  private async ensurePatient(patientId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Пациент не найден');
    }
  }

  private async ensureDoctor(doctorId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Врач не найден');
    }
    return doctor;
  }

  private async ensureService(serviceId: number) {
    const service = await this.prisma.medicalService.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Медицинская услуга не найдена');
    }
    return service;
  }

  private async findExisting(id: number) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Запись на приём не найдена');
    }
    return appointment;
  }
}
