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
import { AppointmentsService } from './appointments.service';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get appointments by patient id' })
  getByPatient(
    @Param('patientId', ParseIntPipe) patientId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.getByPatient(patientId, user);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get appointments by doctor id' })
  getByDoctor(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.appointmentsService.getByDoctor(doctorId, user);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots for doctor on date' })
  getAvailableSlots(@Query() query: AvailableSlotsQueryDto) {
    return this.appointmentsService.getAvailableSlots(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get appointments list' })
  findAll(@Query() query: AppointmentsQueryDto, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by id' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.findOne(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.PATIENT)
  @ApiOperation({ summary: 'Create appointment' })
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.REGISTRAR)
  @ApiOperation({ summary: 'Update appointment' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.REGISTRAR, Role.PATIENT)
  @ApiOperation({ summary: 'Cancel appointment' })
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.cancel(id, user);
  }

  @Patch(':id/complete')
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Complete appointment' })
  complete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.appointmentsService.complete(id, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete appointment' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
