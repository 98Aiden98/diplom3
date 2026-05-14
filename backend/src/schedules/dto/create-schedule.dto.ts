import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  doctorId!: number;

  @ApiProperty({ example: 1, description: '1 = Monday, 7 = Sunday' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek!: number;

  @ApiProperty({ example: '09:00' })
  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @ApiProperty({ example: '17:00' })
  @Matches(/^\d{2}:\d{2}$/)
  endTime!: string;

  @ApiPropertyOptional({ example: '101' })
  @IsOptional()
  @IsString()
  cabinetNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
