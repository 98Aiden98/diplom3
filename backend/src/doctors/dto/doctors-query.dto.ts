import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class DoctorsQueryDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  specializationId?: number;

  @ApiPropertyOptional({ example: 'кардиолог' })
  @IsOptional()
  @IsString()
  query?: string;
}
