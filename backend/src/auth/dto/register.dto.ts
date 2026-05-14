import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class RegisterDto {
  @ApiProperty({ example: 'Иван Петров' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'ivan.petrov@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Secure123!' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '+79991234567' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: '1995-04-18' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthDate!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiPropertyOptional({ example: 'Москва, ул. Примерная, д. 5' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  policyNumber?: string;

  @ApiPropertyOptional({ example: '4510123456' })
  @IsOptional()
  @IsString()
  passportNumber?: string;
}
