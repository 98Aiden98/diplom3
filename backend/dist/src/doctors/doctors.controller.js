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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_doctor_dto_1 = require("./dto/create-doctor.dto");
const doctors_query_dto_1 = require("./dto/doctors-query.dto");
const update_doctor_dto_1 = require("./dto/update-doctor.dto");
const doctors_service_1 = require("./doctors.service");
const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads', 'doctors');
const storeDoctorPhoto = (file) => {
    if (!file) {
        return undefined;
    }
    if (!file.mimetype.startsWith('image/')) {
        throw new common_1.BadRequestException('Можно загружать только изображения');
    }
    if (!(0, fs_1.existsSync)(uploadsDir)) {
        (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
    }
    const extension = (0, path_1.extname)(file.originalname) || '.jpg';
    const filename = `doctor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
    (0, fs_1.writeFileSync)((0, path_1.join)(uploadsDir, filename), file.buffer);
    return `/uploads/doctors/${filename}`;
};
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    getBySpecialization(specializationId) {
        return this.doctorsService.getBySpecialization(specializationId);
    }
    getSchedule(id) {
        return this.doctorsService.getSchedule(id);
    }
    getAppointments(id, user) {
        return this.doctorsService.getAppointments(id, user);
    }
    findAll(query) {
        return this.doctorsService.findAll(query);
    }
    findOne(id) {
        return this.doctorsService.findOne(id);
    }
    create(dto, file) {
        return this.doctorsService.create(dto, storeDoctorPhoto(file));
    }
    update(id, dto, file) {
        return this.doctorsService.update(id, dto, storeDoctorPhoto(file));
    }
    remove(id) {
        return this.doctorsService.remove(id);
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)('by-specialization/:specializationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors by specialization' }),
    __param(0, (0, common_1.Param)('specializationId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getBySpecialization", null);
__decorate([
    (0, common_1.Get)(':id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor schedule' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Get)(':id/appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor appointments' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [doctors_query_dto_1.DoctorsQueryDto]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create doctor' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_doctor_dto_1.CreateDoctorDto, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_doctor_dto_1.UpdateDoctorDto, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete doctor' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "remove", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, swagger_1.ApiTags)('Doctors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('doctors'),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map