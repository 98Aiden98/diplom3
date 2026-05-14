"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecializationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_specialization_dto_1 = require("./create-specialization.dto");
class UpdateSpecializationDto extends (0, mapped_types_1.PartialType)(create_specialization_dto_1.CreateSpecializationDto) {
}
exports.UpdateSpecializationDto = UpdateSpecializationDto;
//# sourceMappingURL=update-specialization.dto.js.map