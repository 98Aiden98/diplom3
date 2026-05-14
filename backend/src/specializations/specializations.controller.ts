import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationsService } from './specializations.service';

@ApiTags('Specializations')
@ApiBearerAuth()
@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all specializations' })
  findAll() {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specialization by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specializationsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create specialization' })
  create(@Body() dto: CreateSpecializationDto) {
    return this.specializationsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update specialization' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpecializationDto) {
    return this.specializationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete specialization' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.specializationsService.remove(id);
  }
}
