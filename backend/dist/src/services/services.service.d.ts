import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceDto): Promise<{
        message: string;
        data: {
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
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    findOne(id: number): Promise<{
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
    }>;
    update(id: number, dto: UpdateServiceDto): Promise<{
        message: string;
        data: {
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
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
    getBySpecialization(specializationId: number): Promise<({
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
    })[]>;
    private ensureSpecialization;
}
