import { RequestUser } from '../common/interfaces/request-user.interface';
import { PrismaService } from '../database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePatientDto): Promise<{
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
            } | null;
        } & {
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
    }>;
    findAll(user: RequestUser, query: SearchPatientsDto): Promise<({
        user: {
            fullName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
    } & {
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
    })[]>;
    findOne(id: number, user: RequestUser): Promise<{
        user: {
            fullName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
    } & {
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
    }>;
    update(id: number, dto: UpdatePatientDto): Promise<{
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
            } | null;
        } & {
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
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
    search(user: RequestUser, query: SearchPatientsDto): Promise<({
        user: {
            fullName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
    } & {
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
    })[]>;
    getRecords(id: number, user: RequestUser): Promise<({
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
    getHistory(id: number, user: RequestUser): Promise<({
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
    private searchWhere;
    private getDoctorByUserId;
    private getPatientByUserId;
    private ensurePatientAccess;
    private ensureExists;
    private assertPolicyNumberAvailable;
}
