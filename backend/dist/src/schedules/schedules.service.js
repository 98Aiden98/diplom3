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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const time_util_1 = require("../common/utils/time.util");
const prisma_service_1 = require("../database/prisma.service");
let SchedulesService = class SchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async create(dto) {
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
    async update(id, dto) {
        const existing = await this.prisma.doctorSchedule.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Расписание не найдено');
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
    async remove(id) {
        const schedule = await this.prisma.doctorSchedule.findUnique({ where: { id } });
        if (!schedule) {
            throw new common_1.NotFoundException('Расписание не найдено');
        }
        await this.prisma.doctorSchedule.delete({ where: { id } });
        return {
            message: 'Расписание удалено',
            data: { id },
        };
    }
    async getDoctorSchedules(doctorId) {
        await this.ensureDoctor(doctorId);
        return this.prisma.doctorSchedule.findMany({
            where: { doctorId },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async validateRange(doctorId, dayOfWeek, startTime, endTime, excludeId) {
        if ((0, time_util_1.timeToMinutes)(startTime) >= (0, time_util_1.timeToMinutes)(endTime)) {
            throw new common_1.ConflictException('Время начала должно быть раньше времени окончания');
        }
        const schedules = await this.prisma.doctorSchedule.findMany({
            where: {
                doctorId,
                dayOfWeek,
                ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
        });
        const overlapping = schedules.find((schedule) => (0, time_util_1.rangesOverlap)(schedule.startTime, schedule.endTime, startTime, endTime));
        if (overlapping) {
            throw new common_1.ConflictException('Расписание пересекается с уже существующим интервалом');
        }
    }
    async ensureDoctor(doctorId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map