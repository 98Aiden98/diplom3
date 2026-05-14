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
exports.CreatePatientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../common/enums/gender.enum");
class CreatePatientDto {
    userId;
    fullName;
    birthDate;
    gender;
    phone;
    email;
    address;
    passportNumber;
    policyNumber;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePatientDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Пётр Сидоров' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1988-09-21' }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: gender_enum_1.Gender, example: gender_enum_1.Gender.MALE }),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+79991239876' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'patient@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Санкт-Петербург, Невский пр., 10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '4510112233' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "passportNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '8900123456789012' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "policyNumber", void 0);
//# sourceMappingURL=create-patient.dto.js.map