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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const search_patients_dto_1 = require("./dto/search-patients.dto");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const patients_service_1 = require("./patients.service");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    search(user, query) {
        return this.patientsService.search(user, query);
    }
    getRecords(id, user) {
        return this.patientsService.getRecords(id, user);
    }
    getHistory(id, user) {
        return this.patientsService.getHistory(id, user);
    }
    findAll(user, query) {
        return this.patientsService.findAll(user, query);
    }
    findOne(id, user) {
        return this.patientsService.findOne(id, user);
    }
    create(dto) {
        return this.patientsService.create(dto);
    }
    update(id, dto) {
        return this.patientsService.update(id, dto);
    }
    remove(id) {
        return this.patientsService.remove(id);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR, role_enum_1.Role.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_patients_dto_1.SearchPatientsDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id/records'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient medical records' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getRecords", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient visit history' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patients list' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_patients_dto_1.SearchPatientsDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR),
    (0, swagger_1.ApiOperation)({ summary: 'Create patient' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_patient_dto_1.UpdatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete patient' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "remove", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_1.ApiTags)('Patients'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('patients'),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map