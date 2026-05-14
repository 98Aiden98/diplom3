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
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctor schedules' })
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get doctor schedules by doctor id' })
  getDoctorSchedules(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.schedulesService.getDoctorSchedules(doctorId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create doctor schedule' })
  create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update doctor schedule' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleDto) {
    return this.schedulesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete doctor schedule' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulesService.remove(id);
  }
}
