import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAppointmentDto, user: RequestUser): Promise<{
        message: string;
        data: {
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
            service: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
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
        };
    }>;
    findAll(query: AppointmentsQueryDto, user: RequestUser): Promise<({
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
        service: {
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
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
    findOne(id: number, user: RequestUser): Promise<{
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
        service: {
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
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
    }>;
    update(id: number, dto: UpdateAppointmentDto): Promise<{
        message: string;
        data: {
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
            service: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
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
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
    cancel(id: number, user: RequestUser): Promise<{
        message: string;
        data: {
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
            service: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
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
        };
    }>;
    complete(id: number, user: RequestUser): Promise<{
        message: string;
        data: {
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
            service: {
                specialization: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
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
        };
    }>;
    getByPatient(patientId: number, user: RequestUser): Promise<({
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
        service: {
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
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
    getByDoctor(doctorId: number, user: RequestUser): Promise<({
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
        service: {
            specialization: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
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
    getAvailableSlots(query: AvailableSlotsQueryDto): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
    private includeShape;
    private ensureDoctorAvailability;
    private ensurePatientAvailability;
    private resolvePatientId;
    private getPatientIdByUser;
    private getDoctorIdByUser;
    private ensureDoctorAccess;
    private ensurePatientAccess;
    private ensureCompletionAccess;
    private ensureAccess;
    private ensurePatient;
    private ensureDoctor;
    private ensureService;
    private findExisting;
}
