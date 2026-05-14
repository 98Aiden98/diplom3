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
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const schedules_service_1 = require("./schedules.service");
let SchedulesController = class SchedulesController {
    schedulesService;
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    findAll() {
        return this.schedulesService.findAll();
    }
    getDoctorSchedules(doctorId) {
        return this.schedulesService.getDoctorSchedules(doctorId);
    }
    create(dto) {
        return this.schedulesService.create(dto);
    }
    update(id, dto) {
        return this.schedulesService.update(id, dto);
    }
    remove(id) {
        return this.schedulesService.remove(id);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all doctor schedules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor schedules by doctor id' }),
    __param(0, (0, common_1.Param)('doctorId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "getDoctorSchedules", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create doctor schedule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor schedule' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete doctor schedule' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "remove", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, swagger_1.ApiTags)('Schedules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schedules'),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map