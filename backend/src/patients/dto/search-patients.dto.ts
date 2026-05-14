import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchPatientsDto {
  @ApiPropertyOptional({ example: 'Иванов' })
  @IsOptional()
  @IsString()
  query?: string;
}
