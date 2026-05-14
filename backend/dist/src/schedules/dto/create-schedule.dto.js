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
exports.CreateScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateScheduleDto {
    doctorId;
    dayOfWeek;
    startTime;
    endTime;
    cabinetNumber;
    isActive;
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: '1 = Monday, 7 = Sunday' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], CreateScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00' }),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '17:00' }),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '101' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "cabinetNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-schedule.dto.js.map