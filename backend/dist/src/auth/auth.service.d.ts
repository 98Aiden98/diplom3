import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: number;
                fullName: string;
                email: string;
                role: Role;
                phone: string | null;
                patient: {} | null;
                doctor: {} | null;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: number;
                fullName: string;
                email: string;
                role: Role;
                phone: string | null;
                patient: {} | null;
                doctor: {} | null;
            };
        };
    }>;
    me(userId: number): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: Role;
        phone: string | null;
        patient: {} | null;
        doctor: {} | null;
    }>;
    private signToken;
    private serializeUser;
}
