import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Первичный приём кардиолога' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Консультация врача-кардиолога с первичным осмотром.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(5)
  durationMinutes!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  specializationId!: number;
}
