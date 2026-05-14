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
exports.CreateServiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateServiceDto {
    name;
    description;
    price;
    durationMinutes;
    specializationId;
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Первичный приём кардиолога' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Консультация врача-кардиолога с первичным осмотром.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2500 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "specializationId", void 0);
//# sourceMappingURL=create-service.dto.js.map