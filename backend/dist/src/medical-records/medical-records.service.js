"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsService = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../common/enums/role.enum");
const prisma_service_1 = require("../database/prisma.service");
let MedicalRecordsService = class MedicalRecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
            include: {
                medicalRecord: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Приём не найден');
        }
        if (appointment.medicalRecord) {
            throw new common_1.ConflictException('Для этого приёма медицинская запись уже создана');
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
    async findAll(user) {
        if (user.role === role_enum_1.Role.ADMIN || user.role === role_enum_1.Role.REGISTRAR) {
            return this.prisma.medicalRecord.findMany({
                include: this.includeShape(),
                orderBy: { createdAt: 'desc' },
            });
        }
        if (user.role === role_enum_1.Role.DOCTOR) {
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
    async findOne(id, user) {
        const record = await this.prisma.medicalRecord.findUnique({
            where: { id },
            include: this.includeShape(),
        });
        if (!record) {
            throw new common_1.NotFoundException('Медицинская запись не найдена');
        }
        await this.ensureAccess(user, record.patientId, record.doctorId);
        return record;
    }
    async update(id, dto, user) {
        const existing = await this.prisma.medicalRecord.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Медицинская запись не найдена');
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
    async getByPatient(patientId, user) {
        await this.ensurePatientAccess(user, patientId);
        return this.prisma.medicalRecord.findMany({
            where: { patientId },
            include: this.includeShape(),
            orderBy: { createdAt: 'desc' },
        });
    }
    async getByAppointment(appointmentId, user) {
        const record = await this.prisma.medicalRecord.findUnique({
            where: { appointmentId },
            include: this.includeShape(),
        });
        if (!record) {
            throw new common_1.NotFoundException('Медицинская запись не найдена');
        }
        await this.ensureAccess(user, record.patientId, record.doctorId);
        return record;
    }
    includeShape() {
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
    async getDoctorIdByUser(userId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) {
            throw new common_1.ForbiddenException('Профиль врача не найден');
        }
        return doctor.id;
    }
    async getPatientIdByUser(userId) {
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (!patient) {
            throw new common_1.ForbiddenException('Профиль пациента не найден');
        }
        return patient.id;
    }
    async ensureDoctorOwnership(user, doctorId) {
        if (user.role === role_enum_1.Role.ADMIN) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
            return;
        }
        throw new common_1.ForbiddenException('Редактировать запись может только назначенный врач');
    }
    async ensurePatientAccess(user, patientId) {
        if ([role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR].includes(user.role)) {
            return;
        }
        if (user.role === role_enum_1.Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR) {
            const doctorId = await this.getDoctorIdByUser(user.id);
            const relation = await this.prisma.appointment.findFirst({
                where: { doctorId, patientId },
            });
            if (relation) {
                return;
            }
        }
        throw new common_1.ForbiddenException('Доступ запрещён');
    }
    async ensureAccess(user, patientId, doctorId) {
        if ([role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR].includes(user.role)) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
            return;
        }
        if (user.role === role_enum_1.Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
            return;
        }
        throw new common_1.ForbiddenException('Доступ запрещён');
    }
};
exports.MedicalRecordsService = MedicalRecordsService;
exports.MedicalRecordsService = MedicalRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MedicalRecordsService);
//# sourceMappingURL=medical-records.service.js.map