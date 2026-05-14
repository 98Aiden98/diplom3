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
exports.MedicalRecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_medical_record_dto_1 = require("./dto/create-medical-record.dto");
const update_medical_record_dto_1 = require("./dto/update-medical-record.dto");
const medical_records_service_1 = require("./medical-records.service");
let MedicalRecordsController = class MedicalRecordsController {
    medicalRecordsService;
    constructor(medicalRecordsService) {
        this.medicalRecordsService = medicalRecordsService;
    }
    getByPatient(patientId, user) {
        return this.medicalRecordsService.getByPatient(patientId, user);
    }
    getByAppointment(appointmentId, user) {
        return this.medicalRecordsService.getByAppointment(appointmentId, user);
    }
    findAll(user) {
        return this.medicalRecordsService.findAll(user);
    }
    findOne(id, user) {
        return this.medicalRecordsService.findOne(id, user);
    }
    create(dto, user) {
        return this.medicalRecordsService.create(dto, user);
    }
    update(id, dto, user) {
        return this.medicalRecordsService.update(id, dto, user);
    }
};
exports.MedicalRecordsController = MedicalRecordsController;
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical records by patient id' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('appointment/:appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record by appointment id' }),
    __param(0, (0, common_1.Param)('appointmentId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "getByAppointment", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical records list' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Create medical record' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medical_record_dto_1.CreateMedicalRecordDto, Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Update medical record' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_medical_record_dto_1.UpdateMedicalRecordDto, Object]),
    __metadata("design:returntype", void 0)
], MedicalRecordsController.prototype, "update", null);
exports.MedicalRecordsController = MedicalRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Medical records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medical-records'),
    __metadata("design:paramtypes", [medical_records_service_1.MedicalRecordsService])
], MedicalRecordsController);
//# sourceMappingURL=medical-records.controller.js.map