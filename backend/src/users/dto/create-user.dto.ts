import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Мария Иванова' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'registrar@infomed.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Registrar123!' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Role, example: Role.REGISTRAR })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ example: '+79990001122' })
  @IsOptional()
  @IsString()
  phone?: string;
}
