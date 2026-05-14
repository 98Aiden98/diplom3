import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({ example: 'Кардиология' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Диагностика и лечение заболеваний сердца и сосудов.' })
  @IsOptional()
  @IsString()
  description?: string;
}
