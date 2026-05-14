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
exports.CreateDoctorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateDoctorDto {
    userId;
    fullName;
    specializationId;
    phone;
    email;
    cabinetNumber;
    experienceYears;
    description;
    password;
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Александр Кузнецов' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "specializationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+79995554433' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'doctor@infomed.local' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '101' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "cabinetNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDoctorDto.prototype, "experienceYears", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Врач-терапевт с большим опытом ведения хронических пациентов.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Doctor123!' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "password", void 0);
//# sourceMappingURL=create-doctor.dto.js.map