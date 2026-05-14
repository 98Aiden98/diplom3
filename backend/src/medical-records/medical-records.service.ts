import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicalRecordDto, user: RequestUser) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: {
        medicalRecord: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Приём не найден');
    }

    if (appointment.medicalRecord) {
      throw new ConflictException('Для этого приёма медицинская запись уже создана');
    }

    await this.ensureDoctorOwnership(user, appointment.doctorId);

    const record = await this.prisma.$transaction(async (tx) => {
      const createdRecord = await tx.medicalRecord.create({
        data: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          appointmentId: appointment.id,
          complaints: dto.complaints,
          diagnosis: dto.diagnosis,
          treatment: dto.treatment,
          recommendations: dto.recommendations,
          prescriptions: dto.prescriptions,
        },
        include: this.includeShape(),
      });

      await tx.appointment.update({
        where: { id: appointment.id },
        data: { status: 'COMPLETED' },
      });

      return createdRecord;
    });

    return {
      message: 'Медицинская запись создана',
      data: record,
    };
  }

  async findAll(user: RequestUser) {
    if (user.role === Role.ADMIN || user.role === Role.REGISTRAR) {
      return this.prisma.medicalRecord.findMany({
        include: this.includeShape(),
        orderBy: { createdAt: 'desc' },
      });
    }

    if (user.role === Role.DOCTOR) {
      const doctorId = await this.getDoctorIdByUser(user.id);
      return this.prisma.medicalRecord.findMany({
        where: { doctorId },
        include: this.includeShape(),
        orderBy: { createdAt: 'desc' },
      });
    }

    const patientId = await this.getPatientIdByUser(user.id);
    return this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: this.includeShape(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, user: RequestUser) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: this.includeShape(),
    });

    if (!record) {
      throw new NotFoundException('Медицинская запись не найдена');
    }

    await this.ensureAccess(user, record.patientId, record.doctorId);
    return record;
  }

  async update(id: number, dto: UpdateMedicalRecordDto, user: RequestUser) {
    const existing = await this.prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Медицинская запись не найдена');
    }

    await this.ensureDoctorOwnership(user, existing.doctorId);

    const record = await this.prisma.medicalRecord.update({
      where: { id },
      data: {
        complaints: dto.complaints,
        diagnosis: dto.diagnosis,
        treatment: dto.treatment,
        recommendations: dto.recommendations,
        prescriptions: dto.prescriptions,
      },
      include: this.includeShape(),
    });

    return {
      message: 'Медицинская запись обновлена',
      data: record,
    };
  }

  async getByPatient(patientId: number, user: RequestUser) {
    await this.ensurePatientAccess(user, patientId);
    return this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: this.includeShape(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByAppointment(appointmentId: number, user: RequestUser) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { appointmentId },
      include: this.includeShape(),
    });

    if (!record) {
      throw new NotFoundException('Медицинская запись не найдена');
    }

    await this.ensureAccess(user, record.patientId, record.doctorId);
    return record;
  }

  private includeShape() {
    return {
      patient: true,
      doctor: {
        include: {
          specialization: true,
        },
      },
      appointment: {
        include: {
          service: true,
        },
      },
    };
  }

  private async getDoctorIdByUser(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      throw new ForbiddenException('Профиль врача не найден');
    }
    return doctor.id;
  }

  private async getPatientIdByUser(userId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new ForbiddenException('Профиль пациента не найден');
    }
    return patient.id;
  }

  private async ensureDoctorOwnership(user: RequestUser, doctorId: number) {
    if (user.role === Role.ADMIN) {
      return;
    }

    if (user.role === Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
      return;
    }

    throw new ForbiddenException('Редактировать запись может только назначенный врач');
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

  private async ensureAccess(user: RequestUser, patientId: number, doctorId: number) {
    if ([Role.ADMIN, Role.REGISTRAR].includes(user.role)) {
      return;
    }

    if (user.role === Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
      return;
    }

    if (user.role === Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
      return;
    }

    throw new ForbiddenException('Доступ запрещён');
  }
}
