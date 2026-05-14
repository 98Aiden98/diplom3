import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    await this.assertPolicyNumberAvailable(dto.policyNumber);

    const patient = await this.prisma.patient.create({
      data: {
        userId: dto.userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email?.toLowerCase(),
        address: dto.address,
        passportNumber: dto.passportNumber,
        policyNumber: dto.policyNumber,
      },
      include: { user: true },
    });

    return {
      message: 'Пациент создан',
      data: patient,
    };
  }

  async findAll(user: RequestUser, query: SearchPatientsDto) {
    if (user.role === Role.PATIENT) {
      const patient = await this.getPatientByUserId(user.id);
      return patient ? [patient] : [];
    }

    if (user.role === Role.DOCTOR) {
      const doctor = await this.getDoctorByUserId(user.id);
      return this.prisma.patient.findMany({
        where: {
          appointments: { some: { doctorId: doctor.id } },
          ...this.searchWhere(query.query),
        },
        include: { user: true },
        orderBy: { fullName: 'asc' },
      });
    }

    return this.prisma.patient.findMany({
      where: this.searchWhere(query.query),
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, user: RequestUser) {
    await this.ensurePatientAccess(user, id);

    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Пациент не найден');
    }

    return patient;
  }

  async update(id: number, dto: UpdatePatientDto) {
    await this.ensureExists(id);
    await this.assertPolicyNumberAvailable(dto.policyNumber, id);

    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        userId: dto.userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email?.toLowerCase(),
        address: dto.address,
        passportNumber: dto.passportNumber,
        policyNumber: dto.policyNumber,
      },
      include: { user: true },
    });

    return {
      message: 'Данные пациента обновлены',
      data: patient,
    };
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.patient.delete({ where: { id } });

    return {
      message: 'Пациент удалён',
      data: { id },
    };
  }

  search(user: RequestUser, query: SearchPatientsDto) {
    return this.findAll(user, query);
  }

  async getRecords(id: number, user: RequestUser) {
    await this.ensurePatientAccess(user, id);
    await this.ensureExists(id);

    return this.prisma.medicalRecord.findMany({
      where: { patientId: id },
      include: {
        doctor: {
          include: { specialization: true },
        },
        appointment: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistory(id: number, user: RequestUser) {
    await this.ensurePatientAccess(user, id);
    await this.ensureExists(id);

    return this.prisma.appointment.findMany({
      where: { patientId: id },
      include: {
        doctor: {
          include: { specialization: true },
        },
        service: true,
        medicalRecord: true,
      },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    });
  }

  private searchWhere(query?: string) {
    if (!query) {
      return {};
    }

    return {
      OR: [
        { fullName: { contains: query } },
        { phone: { contains: query } },
        { policyNumber: { contains: query } },
      ],
    };
  }

  private async getDoctorByUserId(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      throw new ForbiddenException('Профиль врача не найден');
    }
    return doctor;
  }

  private async getPatientByUserId(userId: number) {
    return this.prisma.patient.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  private async ensurePatientAccess(user: RequestUser, patientId: number) {
    if ([Role.ADMIN, Role.REGISTRAR].includes(user.role)) {
      return;
    }

    if (user.role === Role.PATIENT) {
      const patient = await this.getPatientByUserId(user.id);
      if (!patient || patient.id !== patientId) {
        throw new ForbiddenException('Пациент может просматривать только свои данные');
      }
      return;
    }

    if (user.role === Role.DOCTOR) {
      const doctor = await this.getDoctorByUserId(user.id);
      const hasAccess = await this.prisma.appointment.findFirst({
        where: {
          doctorId: doctor.id,
          patientId,
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('Врач может открывать карты только своих пациентов');
      }
      return;
    }

    throw new ForbiddenException('Доступ запрещён');
  }

  private async ensureExists(id: number) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Пациент не найден');
    }
  }

  private async assertPolicyNumberAvailable(policyNumber?: string, excludeId?: number) {
    if (!policyNumber) {
      return;
    }

    const existingPatient = await this.prisma.patient.findFirst({
      where: {
        policyNumber,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (existingPatient) {
      throw new ConflictException('Пациент с таким номером полиса уже существует');
    }
  }
}
