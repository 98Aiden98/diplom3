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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const appointment_status_enum_1 = require("../common/enums/appointment-status.enum");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(range) {
        const today = new Date().toISOString().slice(0, 10);
        const dateFilter = this.buildDateFilter(range);
        const completedAppointments = await this.prisma.appointment.findMany({
            where: {
                status: appointment_status_enum_1.AppointmentStatus.COMPLETED,
                ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
            },
            include: { service: true },
        });
        const [patientsCount, doctorsCount, appointmentsTodayCount] = await Promise.all([
            this.prisma.patient.count(),
            this.prisma.doctor.count(),
            this.prisma.appointment.count({
                where: { date: today },
            }),
        ]);
        const revenue = completedAppointments.reduce((sum, appointment) => sum + appointment.service.price, 0);
        return {
            patientsCount,
            doctorsCount,
            appointmentsTodayCount,
            completedAppointmentsCount: completedAppointments.length,
            revenue,
        };
    }
    async getRevenue(range) {
        const completedAppointments = await this.prisma.appointment.findMany({
            where: {
                status: appointment_status_enum_1.AppointmentStatus.COMPLETED,
                ...(Object.keys(this.buildDateFilter(range)).length
                    ? { date: this.buildDateFilter(range) }
                    : {}),
            },
            include: {
                service: true,
            },
            orderBy: { date: 'asc' },
        });
        const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.service.price, 0);
        const byService = completedAppointments.reduce((acc, item) => {
            acc[item.service.name] = (acc[item.service.name] ?? 0) + item.service.price;
            return acc;
        }, {});
        return {
            totalRevenue,
            byService,
            items: completedAppointments,
        };
    }
    async getPopularServices(range) {
        const appointments = await this.prisma.appointment.findMany({
            where: Object.keys(this.buildDateFilter(range)).length
                ? { date: this.buildDateFilter(range) }
                : {},
            include: { service: true },
        });
        const map = new Map();
        for (const appointment of appointments) {
            const current = map.get(appointment.serviceId) ?? {
                serviceId: appointment.serviceId,
                serviceName: appointment.service.name,
                count: 0,
            };
            current.count += 1;
            map.set(appointment.serviceId, current);
        }
        return Array.from(map.values()).sort((a, b) => b.count - a.count);
    }
    async getDoctorsLoad(range) {
        const appointments = await this.prisma.appointment.findMany({
            where: Object.keys(this.buildDateFilter(range)).length
                ? { date: this.buildDateFilter(range) }
                : {},
            include: {
                doctor: {
                    include: { specialization: true },
                },
            },
        });
        const map = new Map();
        for (const appointment of appointments) {
            const current = map.get(appointment.doctorId) ?? {
                doctorId: appointment.doctorId,
                doctorName: appointment.doctor.fullName,
                specialization: appointment.doctor.specialization.name,
                appointmentsCount: 0,
                completedCount: 0,
            };
            current.appointmentsCount += 1;
            if (appointment.status === appointment_status_enum_1.AppointmentStatus.COMPLETED) {
                current.completedCount += 1;
            }
            map.set(appointment.doctorId, current);
        }
        return Array.from(map.values()).sort((a, b) => b.appointmentsCount - a.appointmentsCount);
    }
    buildDateFilter(range) {
        const dateFilter = {};
        if (range.from) {
            dateFilter.gte = range.from;
        }
        if (range.to) {
            dateFilter.lte = range.to;
        }
        return dateFilter;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map