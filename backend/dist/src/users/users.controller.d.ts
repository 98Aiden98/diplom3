import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: RequestUser): Promise<{
        [x: string]: unknown;
    }>;
    findAll(query: UsersQueryDto): Promise<{
        [x: string]: unknown;
    }[]>;
    findOne(id: number): Promise<{
        [x: string]: unknown;
    }>;
    create(dto: CreateUserDto): Promise<{
        message: string;
        data: {
            [x: string]: unknown;
        };
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        message: string;
        data: {
            [x: string]: unknown;
        };
    }>;
    remove(id: number): Promise<{
        message: string;
        data: {
            id: number;
        };
    }>;
}
