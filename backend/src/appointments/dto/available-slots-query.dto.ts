import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Matches } from 'class-validator';

export class AvailableSlotsQueryDto {
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  doctorId!: number;

  @ApiProperty({ example: '2026-05-16' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  serviceId?: number;
}
