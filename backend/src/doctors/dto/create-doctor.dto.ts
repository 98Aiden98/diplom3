import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiProperty({ example: 'Александр Кузнецов' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  specializationId!: number;

  @ApiProperty({ example: '+79995554433' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'doctor@infomed.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '101' })
  @IsString()
  cabinetNumber!: string;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYears!: number;

  @ApiPropertyOptional({
    example: 'Врач-терапевт с большим опытом ведения хронических пациентов.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Doctor123!' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
