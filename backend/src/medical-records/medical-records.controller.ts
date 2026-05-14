import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordsService } from './medical-records.service';

@ApiTags('Medical records')
@ApiBearerAuth()
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical records by patient id' })
  getByPatient(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.medicalRecordsService.getByPatient(patientId, user);
  }

  @Get('appointment/:appointmentId')
  @ApiOperation({ summary: 'Get medical record by appointment id' })
  getByAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.medicalRecordsService.getByAppointment(appointmentId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get medical records list' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.medicalRecordsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by id' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.medicalRecordsService.findOne(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Create medical record' })
  create(@Body() dto: CreateMedicalRecordDto, @CurrentUser() user: RequestUser) {
    return this.medicalRecordsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Update medical record' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalRecordDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.medicalRecordsService.update(id, dto, user);
  }
}
