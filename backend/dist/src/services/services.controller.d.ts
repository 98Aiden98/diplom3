import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
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
}
