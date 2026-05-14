import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches } from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class CreatePatientDto {
  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiProperty({ example: 'Пётр Сидоров' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '1988-09-21' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthDate!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ example: '+79991239876' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: 'patient@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Санкт-Петербург, Невский пр., 10' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '4510112233' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ example: '8900123456789012' })
  @IsOptional()
  @IsString()
  policyNumber?: string;
}
