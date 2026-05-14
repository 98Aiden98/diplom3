import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsQueryDto } from './dto/doctors-query.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorsService } from './doctors.service';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getBySpecialization(specializationId: number): Promise<({
        specialization: {
            id: number;
            name: string;
            description: string | null;
        };
        schedules: {
            id: number;
            cabinetNumber: string | null;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
            doctorId: number;
        }[];
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
    })[]>;
    getSchedule(id: number): Promise<{
        id: number;
        cabinetNumber: string | null;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
        doctorId: number;
    }[]>;
    getAppointments(id: number, user: RequestUser): Promise<({
        patient: {
            fullName: string;
            email: string | null;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
            birthDate: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
            passportNumber: string | null;
            policyNumber: string | null;
        };
        service: {
            id: number;
            name: string;
            description: string | null;
            specializationId: number;
            price: number;
            durationMinutes: number;
        };
        medicalRecord: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            doctorId: number;
            patientId: number;
            complaints: string;
            diagnosis: string;
            treatment: string;
            recommendations: string;
            prescriptions: string | null;
            appointmentId: number;
        } | null;
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
    })[]>;
    findAll(query: DoctorsQueryDto): Promise<({
        user: {
            fullName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        specialization: {
            id: number;
            name: string;
            description: string | null;
        };
        schedules: {
            id: number;
            cabinetNumber: string | null;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
            doctorId: number;
        }[];
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
    })[]>;
    findOne(id: number): Promise<{
        user: {
            fullName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        specialization: {
            id: number;
            name: string;
            description: string | null;
        };
        schedules: {
            id: number;
            cabinetNumber: string | null;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
            doctorId: number;
        }[];
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
    }>;
    create(dto: CreateDoctorDto, file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<{
        message: string;
        data: {
            user: {
                fullName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
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
    }>;
    update(id: number, dto: UpdateDoctorDto, file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<{
        message: string;
        data: {
            user: {
                fullName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
            schedules: {
                id: number;
                cabinetNumber: string | null;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
                isActive: boolean;
                doctorId: number;
            }[];
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
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
}
