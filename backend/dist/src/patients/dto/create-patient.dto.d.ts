import { Gender } from '../../common/enums/gender.enum';
export declare class CreatePatientDto {
    userId?: number;
    fullName: string;
    birthDate: string;
    gender: Gender;
    phone: string;
    email?: string;
    address?: string;
    passportNumber?: string;
    policyNumber?: string;
}
