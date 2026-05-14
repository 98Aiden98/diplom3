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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../common/enums/role.enum");
const prisma_service_1 = require("../database/prisma.service");
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findAll(user, query) {
        if (user.role === role_enum_1.Role.PATIENT) {
            const patient = await this.getPatientByUserId(user.id);
            return patient ? [patient] : [];
        }
        if (user.role === role_enum_1.Role.DOCTOR) {
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
    async findOne(id, user) {
        await this.ensurePatientAccess(user, id);
        const patient = await this.prisma.patient.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Пациент не найден');
        }
        return patient;
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.patient.delete({ where: { id } });
        return {
            message: 'Пациент удалён',
            data: { id },
        };
    }
    search(user, query) {
        return this.findAll(user, query);
    }
    async getRecords(id, user) {
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
    async getHistory(id, user) {
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
    searchWhere(query) {
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
    async getDoctorByUserId(userId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) {
            throw new common_1.ForbiddenException('Профиль врача не найден');
        }
        return doctor;
    }
    async getPatientByUserId(userId) {
        return this.prisma.patient.findUnique({
            where: { userId },
            include: { user: true },
        });
    }
    async ensurePatientAccess(user, patientId) {
        if ([role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR].includes(user.role)) {
            return;
        }
        if (user.role === role_enum_1.Role.PATIENT) {
            const patient = await this.getPatientByUserId(user.id);
            if (!patient || patient.id !== patientId) {
                throw new common_1.ForbiddenException('Пациент может просматривать только свои данные');
            }
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR) {
            const doctor = await this.getDoctorByUserId(user.id);
            const hasAccess = await this.prisma.appointment.findFirst({
                where: {
                    doctorId: doctor.id,
                    patientId,
                },
            });
            if (!hasAccess) {
                throw new common_1.ForbiddenException('Врач может открывать карты только своих пациентов');
            }
            return;
        }
        throw new common_1.ForbiddenException('Доступ запрещён');
    }
    async ensureExists(id) {
        const patient = await this.prisma.patient.findUnique({ where: { id } });
        if (!patient) {
            throw new common_1.NotFoundException('Пациент не найден');
        }
    }
    async assertPolicyNumberAvailable(policyNumber, excludeId) {
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
            throw new common_1.ConflictException('Пациент с таким номером полиса уже существует');
        }
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map