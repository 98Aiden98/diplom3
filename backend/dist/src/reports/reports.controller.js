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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const report_range_dto_1 = require("./dto/report-range.dto");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getSummary(range) {
        return this.reportsService.getSummary(range);
    }
    getRevenue(range) {
        return this.reportsService.getRevenue(range);
    }
    getPopularServices(range) {
        return this.reportsService.getPopularServices(range);
    }
    getDoctorsLoad(range) {
        return this.reportsService.getDoctorsLoad(range);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_range_dto_1.ReportRangeDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_range_dto_1.ReportRangeDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('popular-services'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular services report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_range_dto_1.ReportRangeDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getPopularServices", null);
__decorate([
    (0, common_1.Get)('doctors-load'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors load report' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_range_dto_1.ReportRangeDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDoctorsLoad", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map