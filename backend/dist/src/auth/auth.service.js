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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const role_enum_1 = require("../common/enums/role.enum");
const prisma_service_1 = require("../database/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    fullName: dto.fullName,
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    role: role_enum_1.Role.PATIENT,
                    phone: dto.phone,
                },
            });
            await tx.patient.create({
                data: {
                    userId: createdUser.id,
                    fullName: dto.fullName,
                    birthDate: dto.birthDate,
                    gender: dto.gender,
                    phone: dto.phone,
                    email: dto.email.toLowerCase(),
                    address: dto.address,
                    policyNumber: dto.policyNumber,
                    passportNumber: dto.passportNumber,
                },
            });
            return createdUser;
        });
        const accessToken = await this.signToken(user);
        return {
            message: 'Регистрация выполнена успешно',
            data: {
                accessToken,
                user: await this.me(user.id),
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            include: {
                patient: true,
                doctor: {
                    include: { specialization: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        const accessToken = await this.signToken(user);
        return {
            message: 'Вход выполнен успешно',
            data: {
                accessToken,
                user: this.serializeUser(user),
            },
        };
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                patient: true,
                doctor: {
                    include: { specialization: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Пользователь не найден');
        }
        return this.serializeUser(user);
    }
    async signToken(user) {
        return this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        });
    }
    serializeUser(user) {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            patient: user.patient ?? null,
            doctor: user.doctor ?? null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map