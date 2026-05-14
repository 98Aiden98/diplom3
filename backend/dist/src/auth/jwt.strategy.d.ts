import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { RequestUser } from '../common/interfaces/request-user.interface';
interface JwtPayload {
    sub: number;
    email: string;
    role: Role;
    fullName: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): RequestUser;
}
export {};
