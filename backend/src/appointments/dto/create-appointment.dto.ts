import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientId?: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  doctorId!: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  serviceId!: number;

  @ApiProperty({ example: '2026-05-16' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiProperty({ example: '10:00' })
  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @ApiPropertyOptional({ example: 'Боль в груди' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Пожалуйста, напомнить пациенту за день.' })
  @IsOptional()
  @IsString()
  comment?: string;
}
