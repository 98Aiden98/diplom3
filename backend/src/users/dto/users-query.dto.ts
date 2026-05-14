import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UsersQueryDto {
  @ApiPropertyOptional({ example: 'Иван' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.DOCTOR })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
