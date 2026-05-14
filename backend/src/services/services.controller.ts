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
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('by-specialization/:specializationId')
  @ApiOperation({ summary: 'Get services by specialization' })
  getBySpecialization(
    @Param('specializationId', ParseIntPipe) specializationId: number,
  ) {
    return this.servicesService.getBySpecialization(specializationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medical services' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical service by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create medical service' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update medical service' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete medical service' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
