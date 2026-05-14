import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { ReportRangeDto } from './dto/report-range.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(range: ReportRangeDto) {
    const today = new Date().toISOString().slice(0, 10);
    const dateFilter = this.buildDateFilter(range);
    const completedAppointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETED,
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

    const revenue = completedAppointments.reduce(
      (sum, appointment) => sum + appointment.service.price,
      0,
    );

    return {
      patientsCount,
      doctorsCount,
      appointmentsTodayCount,
      completedAppointmentsCount: completedAppointments.length,
      revenue,
    };
  }

  async getRevenue(range: ReportRangeDto) {
    const completedAppointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETED,
        ...(Object.keys(this.buildDateFilter(range)).length
          ? { date: this.buildDateFilter(range) }
          : {}),
      },
      include: {
        service: true,
      },
      orderBy: { date: 'asc' },
    });

    const totalRevenue = completedAppointments.reduce(
      (sum, appointment) => sum + appointment.service.price,
      0,
    );

    const byService = completedAppointments.reduce<Record<string, number>>((acc, item) => {
      acc[item.service.name] = (acc[item.service.name] ?? 0) + item.service.price;
      return acc;
    }, {});

    return {
      totalRevenue,
      byService,
      items: completedAppointments,
    };
  }

  async getPopularServices(range: ReportRangeDto) {
    const appointments = await this.prisma.appointment.findMany({
      where: Object.keys(this.buildDateFilter(range)).length
        ? { date: this.buildDateFilter(range) }
        : {},
      include: { service: true },
    });

    const map = new Map<number, { serviceId: number; serviceName: string; count: number }>();

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

  async getDoctorsLoad(range: ReportRangeDto) {
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

    const map = new Map<
      number,
      {
        doctorId: number;
        doctorName: string;
        specialization: string;
        appointmentsCount: number;
        completedCount: number;
      }
    >();

    for (const appointment of appointments) {
      const current = map.get(appointment.doctorId) ?? {
        doctorId: appointment.doctorId,
        doctorName: appointment.doctor.fullName,
        specialization: appointment.doctor.specialization.name,
        appointmentsCount: 0,
        completedCount: 0,
      };

      current.appointmentsCount += 1;
      if (appointment.status === AppointmentStatus.COMPLETED) {
        current.completedCount += 1;
      }
      map.set(appointment.doctorId, current);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.appointmentsCount - a.appointmentsCount,
    );
  }

  private buildDateFilter(range: ReportRangeDto) {
    const dateFilter: Record<string, string> = {};

    if (range.from) {
      dateFilter.gte = range.from;
    }
    if (range.to) {
      dateFilter.lte = range.to;
    }

    return dateFilter;
  }
}
