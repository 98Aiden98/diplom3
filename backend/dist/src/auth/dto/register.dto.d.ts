import { Gender } from '../../common/enums/gender.enum';
export declare class RegisterDto {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    birthDate: string;
    gender: Gender;
    address?: string;
    policyNumber?: string;
    passportNumber?: string;
}
