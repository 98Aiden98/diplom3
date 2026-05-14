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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const appointments_service_1 = require("./appointments.service");
const appointments_query_dto_1 = require("./dto/appointments-query.dto");
const available_slots_query_dto_1 = require("./dto/available-slots-query.dto");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const update_appointment_dto_1 = require("./dto/update-appointment.dto");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    getByPatient(patientId, user) {
        return this.appointmentsService.getByPatient(patientId, user);
    }
    getByDoctor(doctorId, user) {
        return this.appointmentsService.getByDoctor(doctorId, user);
    }
    getAvailableSlots(query) {
        return this.appointmentsService.getAvailableSlots(query);
    }
    findAll(query, user) {
        return this.appointmentsService.findAll(query, user);
    }
    findOne(id, user) {
        return this.appointmentsService.findOne(id, user);
    }
    create(dto, user) {
        return this.appointmentsService.create(dto, user);
    }
    update(id, dto) {
        return this.appointmentsService.update(id, dto);
    }
    cancel(id, user) {
        return this.appointmentsService.cancel(id, user);
    }
    complete(id, user) {
        return this.appointmentsService.complete(id, user);
    }
    remove(id) {
        return this.appointmentsService.remove(id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments by patient id' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getByPatient", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments by doctor id' }),
    __param(0, (0, common_1.Param)('doctorId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getByDoctor", null);
__decorate([
    (0, common_1.Get)('available-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for doctor on date' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [available_slots_query_dto_1.AvailableSlotsQueryDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments list' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointments_query_dto_1.AppointmentsQueryDto, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointment by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR, role_enum_1.Role.PATIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Create appointment' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR),
    (0, swagger_1.ApiOperation)({ summary: 'Update appointment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_appointment_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.REGISTRAR, role_enum_1.Role.PATIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel appointment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.DOCTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Complete appointment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "complete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete appointment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "remove", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map