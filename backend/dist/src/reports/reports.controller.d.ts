import { ReportRangeDto } from './dto/report-range.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSummary(range: ReportRangeDto): Promise<{
        patientsCount: number;
        doctorsCount: number;
        appointmentsTodayCount: number;
        completedAppointmentsCount: number;
        revenue: number;
    }>;
    getRevenue(range: ReportRangeDto): Promise<{
        totalRevenue: number;
        byService: Record<string, number>;
        items: ({
            service: {
                id: number;
                name: string;
                description: string | null;
                specializationId: number;
                price: number;
                durationMinutes: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            startTime: string;
            endTime: string;
            doctorId: number;
            date: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            reason: string | null;
            comment: string | null;
            patientId: number;
            serviceId: number;
        })[];
    }>;
    getPopularServices(range: ReportRangeDto): Promise<{
        serviceId: number;
        serviceName: string;
        count: number;
    }[]>;
    getDoctorsLoad(range: ReportRangeDto): Promise<{
        doctorId: number;
        doctorName: string;
        specialization: string;
        appointmentsCount: number;
        completedCount: number;
    }[]>;
}
