import { Controller, Get, UseGuards, Patch, Body, } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { EditUserDto, UserDto, UserWithRoleDto } from './dto';
import { UserJwtGuard } from 'src/auth/guard';
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserService } from './user.service';
import { User } from '@prisma/client';

@ApiBearerAuth('access_token')
@UseGuards(UserJwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Get me' })
    @ApiResponse({ type: UserWithRoleDto })
    @Get('me')
    getMe(@GetUser() user: User): UserWithRoleDto{
        const { hash_password, ...safeUser} = user;
        return {...safeUser , role : "user"};
    }

    @ApiOperation({ summary: 'Edit me' })
    @ApiBody({ type: EditUserDto })
    @ApiResponse({ type: UserDto })
    @Patch('me')
    editUser(@GetUser() user: User, @Body() dto: EditUserDto): Promise<UserDto>{
        return this.userService.editUser(user, dto);
    }
}
