"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const patients_module_1 = require("./patients/patients.module");
const doctors_module_1 = require("./doctors/doctors.module");
const specializations_module_1 = require("./specializations/specializations.module");
const services_module_1 = require("./services/services.module");
const appointments_module_1 = require("./appointments/appointments.module");
const schedules_module_1 = require("./schedules/schedules.module");
const medical_records_module_1 = require("./medical-records/medical-records.module");
const reports_module_1 = require("./reports/reports.module");
const prisma_module_1 = require("./database/prisma.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            doctors_module_1.DoctorsModule,
            specializations_module_1.SpecializationsModule,
            services_module_1.ServicesModule,
            appointments_module_1.AppointmentsModule,
            schedules_module_1.SchedulesModule,
            medical_records_module_1.MedicalRecordsModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map