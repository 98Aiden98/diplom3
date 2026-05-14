"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const fs_1 = require("fs");
const path_1 = require("path");
const role_enum_1 = require("../common/enums/role.enum");
const prisma_service_1 = require("../database/prisma.service");
let DoctorsService = class DoctorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, photoUrl) {
        await this.ensureSpecialization(dto.specializationId);
        const user = await this.resolveOrCreateDoctorUser(dto);
        const doctor = await this.prisma.doctor.create({
            data: {
                userId: user.id,
                fullName: dto.fullName,
                specializationId: dto.specializationId,
                phone: dto.phone,
                email: dto.email.toLowerCase(),
                photoUrl,
                cabinetNumber: dto.cabinetNumber,
                experienceYears: dto.experienceYears,
                description: dto.description,
            },
            include: {
                user: true,
                specialization: true,
            },
        });
        return {
            message: 'Врач создан',
            data: doctor,
        };
    }
    async findAll(query) {
        return this.prisma.doctor.findMany({
            where: {
                specializationId: query.specializationId,
                ...(query.query
                    ? {
                        OR: [
                            { fullName: { contains: query.query } },
                            { email: { contains: query.query } },
                            {
                                specialization: {
                                    name: { contains: query.query },
                                },
                            },
                        ],
                    }
                    : {}),
            },
            include: {
                specialization: true,
                user: true,
                schedules: true,
            },
            orderBy: { fullName: 'asc' },
        });
    }
    async findOne(id) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                specialization: true,
                user: true,
                schedules: true,
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
        return doctor;
    }
    async update(id, dto, photoUrl) {
        const existingDoctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!existingDoctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
        if (dto.specializationId) {
            await this.ensureSpecialization(dto.specializationId);
        }
        if (dto.email) {
            const emailOwner = await this.prisma.user.findFirst({
                where: {
                    email: dto.email.toLowerCase(),
                    NOT: { id: existingDoctor.userId },
                },
            });
            if (emailOwner) {
                throw new common_1.ConflictException('Пользователь с таким email уже существует');
            }
        }
        const doctor = await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: existingDoctor.userId },
                data: {
                    fullName: dto.fullName,
                    email: dto.email?.toLowerCase(),
                    phone: dto.phone,
                    ...(dto.password ? { passwordHash: await bcrypt.hash(dto.password, 10) } : {}),
                },
            });
            return tx.doctor.update({
                where: { id },
                data: {
                    fullName: dto.fullName,
                    specializationId: dto.specializationId,
                    phone: dto.phone,
                    email: dto.email?.toLowerCase(),
                    ...(photoUrl ? { photoUrl } : {}),
                    cabinetNumber: dto.cabinetNumber,
                    experienceYears: dto.experienceYears,
                    description: dto.description,
                },
                include: {
                    specialization: true,
                    user: true,
                    schedules: true,
                },
            });
        });
        if (photoUrl && existingDoctor.photoUrl && existingDoctor.photoUrl !== photoUrl) {
            this.deletePhoto(existingDoctor.photoUrl);
        }
        return {
            message: 'Профиль врача обновлён',
            data: doctor,
        };
    }
    async remove(id) {
        const doctor = await this.prisma.doctor.findUnique({ where: { id } });
        if (!doctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.doctor.delete({ where: { id } });
            await tx.user.delete({ where: { id: doctor.userId } });
        });
        this.deletePhoto(doctor.photoUrl);
        return {
            message: 'Врач удалён',
            data: { id },
        };
    }
    async getBySpecialization(specializationId) {
        await this.ensureSpecialization(specializationId);
        return this.prisma.doctor.findMany({
            where: { specializationId },
            include: {
                specialization: true,
                schedules: { where: { isActive: true } },
            },
            orderBy: { fullName: 'asc' },
        });
    }
    async getSchedule(id) {
        await this.ensureExists(id);
        return this.prisma.doctorSchedule.findMany({
            where: { doctorId: id },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async getAppointments(id, user) {
        if (user.role === role_enum_1.Role.DOCTOR) {
            const doctor = await this.prisma.doctor.findUnique({ where: { userId: user.id } });
            if (!doctor || doctor.id !== id) {
                throw new common_1.ForbiddenException('Врач может просматривать только свои приёмы');
            }
        }
        await this.ensureExists(id);
        return this.prisma.appointment.findMany({
            where: { doctorId: id },
            include: {
                patient: true,
                service: true,
                medicalRecord: true,
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });
    }
    async resolveOrCreateDoctorUser(dto) {
        if (dto.userId) {
            const existingUser = await this.prisma.user.findUnique({ where: { id: dto.userId } });
            if (!existingUser) {
                throw new common_1.NotFoundException('Связанный пользователь не найден');
            }
            return existingUser;
        }
        if (!dto.password) {
            throw new common_1.BadRequestException('Для нового врача необходимо указать пароль');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        return this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email.toLowerCase(),
                phone: dto.phone,
                role: role_enum_1.Role.DOCTOR,
                passwordHash: await bcrypt.hash(dto.password, 10),
            },
        });
    }
    async ensureSpecialization(id) {
        const specialization = await this.prisma.specialization.findUnique({ where: { id } });
        if (!specialization) {
            throw new common_1.NotFoundException('Специальность не найдена');
        }
    }
    async ensureExists(id) {
        const doctor = await this.prisma.doctor.findUnique({ where: { id } });
        if (!doctor) {
            throw new common_1.NotFoundException('Врач не найден');
        }
    }
    deletePhoto(photoUrl) {
        if (!photoUrl) {
            return;
        }
        if (photoUrl.endsWith('.svg')) {
            return;
        }
        const normalizedPath = photoUrl.replace(/^\//, '');
        const absolutePath = (0, path_1.join)(process.cwd(), normalizedPath);
        if ((0, fs_1.existsSync)(absolutePath)) {
            (0, fs_1.unlinkSync)(absolutePath);
        }
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map