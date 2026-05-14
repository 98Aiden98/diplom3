import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Matches } from 'class-validator';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class AppointmentsQueryDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  doctorId?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientId?: number;

  @ApiPropertyOptional({ example: '2026-05-16' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus, example: AppointmentStatus.PLANNED })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
