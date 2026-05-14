import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreatePatientDto } from './dto/create-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('search')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.DOCTOR)
  @ApiOperation({ summary: 'Search patients' })
  search(@CurrentUser() user: RequestUser, @Query() query: SearchPatientsDto) {
    return this.patientsService.search(user, query);
  }

  @Get(':id/records')
  @ApiOperation({ summary: 'Get patient medical records' })
  getRecords(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.patientsService.getRecords(id, user);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get patient visit history' })
  getHistory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.patientsService.getHistory(id, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get patients list' })
  findAll(@CurrentUser() user: RequestUser, @Query() query: SearchPatientsDto) {
    return this.patientsService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by id' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.patientsService.findOne(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Create patient' })
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update patient' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Delete patient' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
