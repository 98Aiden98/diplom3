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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const appointment_status_enum_1 = require("../common/enums/appointment-status.enum");
const role_enum_1 = require("../common/enums/role.enum");
const time_util_1 = require("../common/utils/time.util");
const prisma_service_1 = require("../database/prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        const patientId = await this.resolvePatientId(user, dto.patientId);
        const doctor = await this.ensureDoctor(dto.doctorId);
        const service = await this.ensureService(dto.serviceId);
        const endTime = (0, time_util_1.minutesToTime)((0, time_util_1.timeToMinutes)(dto.startTime) + service.durationMinutes);
        if (doctor.specializationId !== service.specializationId) {
            throw new common_1.BadRequestException('Выбранная услуга не относится к специальности врача');
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
    async findAll(query, user) {
        const where = {
            ...(query.doctorId ? { doctorId: query.doctorId } : {}),
            ...(query.patientId ? { patientId: query.patientId } : {}),
            ...(query.date ? { date: query.date } : {}),
            ...(query.status ? { status: query.status } : {}),
        };
        if (user.role === role_enum_1.Role.PATIENT) {
            where.patientId = await this.getPatientIdByUser(user.id);
        }
        if (user.role === role_enum_1.Role.DOCTOR) {
            where.doctorId = await this.getDoctorIdByUser(user.id);
        }
        return this.prisma.appointment.findMany({
            where,
            include: this.includeShape(),
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });
    }
    async findOne(id, user) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: this.includeShape(),
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Запись на приём не найдена');
        }
        await this.ensureAccess(user, appointment.patientId, appointment.doctorId);
        return appointment;
    }
    async update(id, dto) {
        const existing = await this.prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Запись на приём не найдена');
        }
        const patientId = dto.patientId ?? existing.patientId;
        const doctorId = dto.doctorId ?? existing.doctorId;
        const serviceId = dto.serviceId ?? existing.serviceId;
        const date = dto.date ?? existing.date;
        const startTime = dto.startTime ?? existing.startTime;
        const doctor = await this.ensureDoctor(doctorId);
        const service = await this.ensureService(serviceId);
        const endTime = (0, time_util_1.minutesToTime)((0, time_util_1.timeToMinutes)(startTime) + service.durationMinutes);
        if (doctor.specializationId !== service.specializationId) {
            throw new common_1.BadRequestException('Выбранная услуга не относится к специальности врача');
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
    async remove(id) {
        await this.findExisting(id);
        await this.prisma.appointment.delete({ where: { id } });
        return {
            message: 'Запись на приём удалена',
            data: { id },
        };
    }
    async cancel(id, user) {
        const appointment = await this.findExisting(id);
        await this.ensureAccess(user, appointment.patientId, appointment.doctorId, true);
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: appointment_status_enum_1.AppointmentStatus.CANCELLED },
            include: this.includeShape(),
        });
        return {
            message: 'Запись на приём отменена',
            data: updated,
        };
    }
    async complete(id, user) {
        const appointment = await this.findExisting(id);
        await this.ensureCompletionAccess(user, appointment.doctorId);
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: appointment_status_enum_1.AppointmentStatus.COMPLETED },
            include: this.includeShape(),
        });
        return {
            message: 'Приём завершён',
            data: updated,
        };
    }
    async getByPatient(patientId, user) {
        await this.ensurePatientAccess(user, patientId);
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: this.includeShape(),
            orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        });
    }
    async getByDoctor(doctorId, user) {
        await this.ensureDoctorAccess(user, doctorId);
        return this.prisma.appointment.findMany({
            where: { doctorId },
            include: this.includeShape(),
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });
    }
    async getAvailableSlots(query) {
        const doctor = await this.ensureDoctor(query.doctorId);
        const duration = query.serviceId
            ? (await this.ensureService(query.serviceId)).durationMinutes
            : 30;
        const dayOfWeek = (0, time_util_1.getDayOfWeek)(query.date);
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
                status: { not: appointment_status_enum_1.AppointmentStatus.CANCELLED },
            },
        });
        const slots = [];
        for (const schedule of schedules) {
            for (let current = (0, time_util_1.timeToMinutes)(schedule.startTime); current + duration <= (0, time_util_1.timeToMinutes)(schedule.endTime); current += duration) {
                const startTime = (0, time_util_1.minutesToTime)(current);
                const endTime = (0, time_util_1.minutesToTime)(current + duration);
                const hasConflict = appointments.some((appointment) => (0, time_util_1.rangesOverlap)(appointment.startTime, appointment.endTime, startTime, endTime));
                if (!hasConflict) {
                    slots.push({ startTime, endTime });
                }
            }
        }
        return slots;
    }
    includeShape() {
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
    async ensureDoctorAvailability(doctorId, date, startTime, endTime, excludeAppointmentId) {
        const dayOfWeek = (0, time_util_1.getDayOfWeek)(date);
        const schedules = await this.prisma.doctorSchedule.findMany({
            where: {
                doctorId,
                dayOfWeek,
                isActive: true,
            },
        });
        const fitsSchedule = schedules.some((schedule) => (0, time_util_1.timeToMinutes)(startTime) >= (0, time_util_1.timeToMinutes)(schedule.startTime) &&
            (0, time_util_1.timeToMinutes)(endTime) <= (0, time_util_1.timeToMinutes)(schedule.endTime));
        if (!fitsSchedule) {
            throw new common_1.ConflictException('Выбранное время выходит за пределы расписания врача');
        }
        const conflictingAppointment = await this.prisma.appointment.findFirst({
            where: {
                doctorId,
                date,
                status: { not: appointment_status_enum_1.AppointmentStatus.CANCELLED },
                ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
            },
        });
        if (conflictingAppointment &&
            (0, time_util_1.rangesOverlap)(conflictingAppointment.startTime, conflictingAppointment.endTime, startTime, endTime)) {
            throw new common_1.ConflictException('Выбранный слот уже занят у врача');
        }
    }
    async ensurePatientAvailability(patientId, date, startTime, endTime, excludeAppointmentId) {
        const appointments = await this.prisma.appointment.findMany({
            where: {
                patientId,
                date,
                status: { not: appointment_status_enum_1.AppointmentStatus.CANCELLED },
                ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
            },
        });
        const conflict = appointments.find((appointment) => (0, time_util_1.rangesOverlap)(appointment.startTime, appointment.endTime, startTime, endTime));
        if (conflict) {
            throw new common_1.ConflictException('У пациента уже есть запись на это время');
        }
    }
    async resolvePatientId(user, patientId) {
        if (user.role === role_enum_1.Role.PATIENT) {
            return this.getPatientIdByUser(user.id);
        }
        if (!patientId) {
            throw new common_1.BadRequestException('Не указан пациент для записи');
        }
        return patientId;
    }
    async getPatientIdByUser(userId) {
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (!patient) {
            throw new common_1.ForbiddenException('Профиль пациента не найден');
        }
        return patient.id;
    }
    async getDoctorIdByUser(userId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) {
            throw new common_1.ForbiddenException('Профиль врача не найден');
        }
        return doctor.id;
    }
    async ensureDoctorAccess(user, doctorId) {
        if ([role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR].includes(user.role)) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
            return;
        }
        throw new common_1.ForbiddenException('Доступ запрещён');
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
    async ensureCompletionAccess(user, doctorId) {
        if (user.role === role_enum_1.Role.ADMIN) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
            return;
        }
        throw new common_1.ForbiddenException('Завершить приём может только назначенный врач');
    }
    async ensureAccess(user, patientId, doctorId, allowPatientCancel = false) {
        if ([role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR].includes(user.role)) {
            return;
        }
        if (user.role === role_enum_1.Role.DOCTOR && (await this.getDoctorIdByUser(user.id)) === doctorId) {
            return;
        }
        if (user.role === role_enum_1.Role.PATIENT &&
            allowPatientCancel &&
            (await this.getPatientIdByUser(user.id)) === patientId) {
            return;
        }
        if (user.role === role_enum_1.Role.PATIENT && (await this.getPatientIdByUser(user.id)) === patientId) {
            return;
        }
        throw new common_1.ForbiddenException('Доступ запрещён');
    }
    async ensurePatient(patientId) {
        const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new common_1.NotFoundException('Пациент не найден');
        }
    }
    async ensureDoctor(doctorId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
        return doctor;
    }
    async ensureService(serviceId) {
        const service = await this.prisma.medicalService.findUnique({ where: { id: serviceId } });
        if (!service) {
            throw new common_1.NotFoundException('Медицинская услуга не найдена');
        }
        return service;
    }
    async findExisting(id) {
        const appointment = await this.prisma.appointment.findUnique({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException('Запись на приём не найдена');
        }
        return appointment;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map