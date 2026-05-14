import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  appointmentId!: number;

  @ApiProperty({ example: 'Головная боль, повышенное давление.' })
  @IsString()
  complaints!: string;

  @ApiProperty({ example: 'Артериальная гипертензия I степени.' })
  @IsString()
  diagnosis!: string;

  @ApiProperty({ example: 'Медикаментозная терапия, контроль давления.' })
  @IsString()
  treatment!: string;

  @ApiProperty({ example: 'Повторный визит через 2 недели, снизить потребление соли.' })
  @IsString()
  recommendations!: string;

  @ApiPropertyOptional({ example: 'Лозартан 50 мг 1 раз в день.' })
  @IsOptional()
  @IsString()
  prescriptions?: string;
}
