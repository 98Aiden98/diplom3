import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsQueryDto } from './dto/doctors-query.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorsService } from './doctors.service';

const uploadsDir = join(process.cwd(), 'uploads', 'doctors');

const storeDoctorPhoto = (file?: {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}) => {
  if (!file) {
    return undefined;
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new BadRequestException('Можно загружать только изображения');
  }

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = extname(file.originalname) || '.jpg';
  const filename = `doctor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  writeFileSync(join(uploadsDir, filename), file.buffer);

  return `/uploads/doctors/${filename}`;
};

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('by-specialization/:specializationId')
  @ApiOperation({ summary: 'Get doctors by specialization' })
  getBySpecialization(
    @Param('specializationId', ParseIntPipe) specializationId: number,
  ) {
    return this.doctorsService.getBySpecialization(specializationId);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get doctor schedule' })
  getSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.getSchedule(id);
  }

  @Get(':id/appointments')
  @ApiOperation({ summary: 'Get doctor appointments' })
  getAppointments(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: RequestUser,
  ) {
    return this.doctorsService.getAppointments(id, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get doctors list' })
  findAll(@Query() query: DoctorsQueryDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create doctor' })
  create(
    @Body() dto: CreateDoctorDto,
    @UploadedFile() file?: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    return this.doctorsService.create(dto, storeDoctorPhoto(file));
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update doctor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorDto,
    @UploadedFile() file?: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    return this.doctorsService.update(id, dto, storeDoctorPhoto(file));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete doctor' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
