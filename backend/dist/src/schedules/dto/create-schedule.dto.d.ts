export declare class CreateScheduleDto {
    doctorId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    cabinetNumber?: string;
    isActive?: boolean;
}
