import { Role } from '../enums/role.enum';
export interface RequestUser {
    id: number;
    email: string;
    fullName: string;
    role: Role;
}
