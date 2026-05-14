"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.ensureSpecialization(dto.specializationId);
        const exists = await this.prisma.medicalService.findFirst({
            where: {
                name: dto.name,
                specializationId: dto.specializationId,
            },
        });
        if (exists) {
            throw new common_1.ConflictException('Услуга для этой специальности уже существует');
        }
        const service = await this.prisma.medicalService.create({
            data: dto,
            include: { specialization: true },
        });
        return {
            message: 'Медицинская услуга создана',
            data: service,
        };
    }
    findAll() {
        return this.prisma.medicalService.findMany({
            include: { specialization: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const service = await this.prisma.medicalService.findUnique({
            where: { id },
            include: { specialization: true },
        });
        if (!service) {
            throw new common_1.NotFoundException('Медицинская услуга не найдена');
        }
        return service;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        if (dto.specializationId) {
            await this.ensureSpecialization(dto.specializationId);
        }
        if (dto.name || dto.specializationId) {
            const duplicate = await this.prisma.medicalService.findFirst({
                where: {
                    name: dto.name ?? existing.name,
                    specializationId: dto.specializationId ?? existing.specializationId,
                    NOT: { id },
                },
            });
            if (duplicate) {
                throw new common_1.ConflictException('Услуга для этой специальности уже существует');
            }
        }
        const service = await this.prisma.medicalService.update({
            where: { id },
            data: dto,
            include: { specialization: true },
        });
        return {
            message: 'Медицинская услуга обновлена',
            data: service,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.medicalService.delete({ where: { id } });
        return {
            message: 'Медицинская услуга удалена',
            data: { id },
        };
    }
    async getBySpecialization(specializationId) {
        await this.ensureSpecialization(specializationId);
        return this.prisma.medicalService.findMany({
            where: { specializationId },
            include: { specialization: true },
            orderBy: { name: 'asc' },
        });
    }
    async ensureSpecialization(id) {
        const specialization = await this.prisma.specialization.findUnique({
            where: { id },
        });
        if (!specialization) {
            throw new common_1.NotFoundException('Специальность не найдена');
        }
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map