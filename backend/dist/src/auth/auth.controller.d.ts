import type { RequestUser } from '../common/interfaces/request-user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            user: {
                id: number;
                fullName: string;
                email: string;
                role: import("../common/enums/role.enum").Role;
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
                role: import("../common/enums/role.enum").Role;
                phone: string | null;
                patient: {} | null;
                doctor: {} | null;
            };
        };
    }>;
    me(user: RequestUser): Promise<{
        id: number;
        fullName: string;
        email: string;
        role: import("../common/enums/role.enum").Role;
        phone: string | null;
        patient: {} | null;
        doctor: {} | null;
    }>;
}
