"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const express = __importStar(require("express"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const fieldLabels = {
    fullName: 'ФИО',
    email: 'email',
    password: 'пароль',
    phone: 'телефон',
    birthDate: 'дата рождения',
    gender: 'пол',
    address: 'адрес',
    policyNumber: 'номер полиса',
    passportNumber: 'паспорт',
    role: 'роль',
    specializationId: 'специальность',
    cabinetNumber: 'кабинет',
    experienceYears: 'стаж',
    description: 'описание',
    patientId: 'пациент',
    doctorId: 'врач',
    serviceId: 'услуга',
    date: 'дата',
    startTime: 'время начала',
    endTime: 'время окончания',
    appointmentId: 'приём',
    complaints: 'жалобы',
    diagnosis: 'диагноз',
    treatment: 'лечение',
    recommendations: 'рекомендации',
    prescriptions: 'назначения',
    dayOfWeek: 'день недели',
    isActive: 'статус активности',
    query: 'поисковый запрос',
};
const getFieldLabel = (property) => fieldLabels[property] ?? property;
const mapConstraintMessage = (property, constraint) => {
    const label = getFieldLabel(property);
    switch (constraint) {
        case 'isEmail':
            return `Поле "${label}" должно содержать корректный email.`;
        case 'isString':
            return `Поле "${label}" должно быть строкой.`;
        case 'isInt':
            return `Поле "${label}" должно быть целым числом.`;
        case 'isEnum':
            return `Поле "${label}" содержит недопустимое значение.`;
        case 'minLength':
            return `Поле "${label}" заполнено слишком коротко.`;
        case 'min':
            return `Поле "${label}" содержит слишком маленькое значение.`;
        case 'isDateString':
            return `Поле "${label}" должно содержать корректную дату.`;
        case 'isBoolean':
            return `Поле "${label}" должно быть булевым значением.`;
        default:
            return `Поле "${label}" заполнено некорректно.`;
    }
};
const collectValidationMessages = (errors) => errors.flatMap((error) => {
    const ownMessages = error.constraints
        ? Object.keys(error.constraints).map((constraint) => mapConstraintMessage(error.property, constraint))
        : [];
    const nestedMessages = error.children?.length ? collectValidationMessages(error.children) : [];
    return [...ownMessages, ...nestedMessages];
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    const envCorsOrigins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    const corsOrigins = [...new Set([...defaultCorsOrigins, ...envCorsOrigins])];
    const uploadsRoot = (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadsRoot)) {
        (0, fs_1.mkdirSync)(uploadsRoot, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsRoot));
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => new common_1.BadRequestException(collectValidationMessages(errors).length
            ? collectValidationMessages(errors)
            : ['Проверьте корректность заполнения полей.']),
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('ИнфоМед API')
        .setDescription('REST API информационной системы медицинского центра ИнфоМед')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map