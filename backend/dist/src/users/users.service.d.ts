import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        message: string;
        data: {
            [x: string]: unknown;
        };
    }>;
    findAll(query: UsersQueryDto): Promise<{
        [x: string]: unknown;
    }[]>;
    findOne(id: number): Promise<{
        [x: string]: unknown;
    }>;
    me(id: number): Promise<{
        [x: string]: unknown;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        message: string;
        data: {
            [x: string]: unknown;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
    private ensureExists;
    private sanitizeUser;
}
