import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationsService } from './specializations.service';
export declare class SpecializationsController {
    private readonly specializationsService;
    constructor(specializationsService: SpecializationsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        doctors: {
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
        }[];
        services: {
            id: number;
            name: string;
            description: string | null;
            specializationId: number;
            price: number;
            durationMinutes: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
    })[]>;
    findOne(id: number): Promise<{
        doctors: {
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
        }[];
        services: {
            id: number;
            name: string;
            description: string | null;
            specializationId: number;
            price: number;
            durationMinutes: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
    }>;
    create(dto: CreateSpecializationDto): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            description: string | null;
        };
    }>;
    update(id: number, dto: UpdateSpecializationDto): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            description: string | null;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
}
