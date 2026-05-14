import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
export declare class MedicalRecordsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMedicalRecordDto, user: RequestUser): Promise<{
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
            appointment: {
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
            };
        } & {
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
        };
    }>;
    findAll(user: RequestUser): Promise<({
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
        appointment: {
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
        };
    } & {
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
        appointment: {
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
        };
    } & {
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
    }>;
    update(id: number, dto: UpdateMedicalRecordDto, user: RequestUser): Promise<{
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
            appointment: {
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
            };
        } & {
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
        appointment: {
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
        };
    } & {
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
    })[]>;
    getByAppointment(appointmentId: number, user: RequestUser): Promise<{
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
        appointment: {
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
        };
    } & {
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
    }>;
    private includeShape;
    private getDoctorIdByUser;
    private getPatientIdByUser;
    private ensureDoctorOwnership;
    private ensurePatientAccess;
    private ensureAccess;
}
