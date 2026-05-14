import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
export declare class AppointmentsQueryDto {
    doctorId?: number;
    patientId?: number;
    date?: string;
    status?: AppointmentStatus;
}
