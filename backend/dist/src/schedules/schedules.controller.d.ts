import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        doctor: {
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            fullName: string;
            email: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            description: string | null;
            photoUrl: string | null;
            cabinetNumber: string;
            experienceYears: number;
            userId: number;
            specializationId: number;
        };
    } & {
        id: number;
        cabinetNumber: string | null;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
        doctorId: number;
    })[]>;
    getDoctorSchedules(doctorId: number): Promise<{
        id: number;
        cabinetNumber: string | null;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
        doctorId: number;
    }[]>;
    create(dto: CreateScheduleDto): Promise<{
        message: string;
        data: {
            doctor: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
                fullName: string;
                email: string;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                photoUrl: string | null;
                cabinetNumber: string;
                experienceYears: number;
                userId: number;
                specializationId: number;
            };
        } & {
            id: number;
            cabinetNumber: string | null;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
            doctorId: number;
        };
    }>;
    update(id: number, dto: UpdateScheduleDto): Promise<{
        message: string;
        data: {
            doctor: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
                fullName: string;
                email: string;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                photoUrl: string | null;
                cabinetNumber: string;
                experienceYears: number;
                userId: number;
                specializationId: number;
            };
        } & {
            id: number;
            cabinetNumber: string | null;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
            doctorId: number;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
}
