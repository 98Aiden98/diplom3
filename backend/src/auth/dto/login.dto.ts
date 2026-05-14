import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'patient@infomed.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Patient123!' })
  @IsString()
  @MinLength(6)
  password!: string;
}
