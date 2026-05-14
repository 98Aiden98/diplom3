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
exports.SpecializationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_specialization_dto_1 = require("./dto/create-specialization.dto");
const update_specialization_dto_1 = require("./dto/update-specialization.dto");
const specializations_service_1 = require("./specializations.service");
let SpecializationsController = class SpecializationsController {
    specializationsService;
    constructor(specializationsService) {
        this.specializationsService = specializationsService;
    }
    findAll() {
        return this.specializationsService.findAll();
    }
    findOne(id) {
        return this.specializationsService.findOne(id);
    }
    create(dto) {
        return this.specializationsService.create(dto);
    }
    update(id, dto) {
        return this.specializationsService.update(id, dto);
    }
    remove(id) {
        return this.specializationsService.remove(id);
    }
};
exports.SpecializationsController = SpecializationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all specializations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specialization by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create specialization' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialization_dto_1.CreateSpecializationDto]),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update specialization' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_specialization_dto_1.UpdateSpecializationDto]),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete specialization' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "remove", null);
exports.SpecializationsController = SpecializationsController = __decorate([
    (0, swagger_1.ApiTags)('Specializations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('specializations'),
    __metadata("design:paramtypes", [specializations_service_1.SpecializationsService])
], SpecializationsController);
//# sourceMappingURL=specializations.controller.js.map