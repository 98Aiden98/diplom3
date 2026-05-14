export declare class CreateAppointmentDto {
    patientId?: number;
    doctorId: number;
    serviceId: number;
    date: string;
    startTime: string;
    reason?: string;
    comment?: string;
}
