import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminJwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { AdminDto, EditAdminDto } from './dto';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { CreateUserDto, EditUserDto, UserDto } from 'src/user/dto/user.dto';

@ApiBearerAuth('access_token')
@UseGuards(AdminJwtGuard)
@Controller('admins')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @ApiOperation({ summary: 'Get me' })
    @ApiResponse({ type: AdminDto })
    @Get('me')
    getMe(@GetUser() admin: Admin): AdminDto{
        const { hash_password, ...safeAdmin} = admin;
        return safeAdmin;
    }

    @ApiOperation({ summary: 'Edit me' })
    @ApiBody({ type: EditAdminDto })
    @ApiResponse({ type: AdminDto })
    @Patch('me')
    ediAdmin(@GetUser() admin: Admin, @Body() dto: EditAdminDto): Promise<AdminDto>{
        return this.adminService.editAdmin(admin, dto);
    }

    @ApiOperation({ summary: 'Add user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ type: UserDto })
    @Post('users')
    addUser(@Body() dto: CreateUserDto): Promise<UserDto>{
        return this.adminService.addUser(dto);
    }

    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({ type: UserDto, isArray: true })
    @Get('users')
    getUsers(): Promise<UserDto[]>{
        return this.adminService.getUsers();
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ type: UserDto })
    @Get('users/{:id}')
    getUserById(@Param('id') userId: number): Promise<UserDto>{
        return this.adminService.getUserById(userId);
    }

    @ApiOperation({ summary: 'Edit user by id' })
    @ApiBody({ type: EditUserDto })
    @ApiResponse({ type: UserDto })
    @Patch('users/{:id}')
    editUserById(
        @Body() dto: EditUserDto,
        @Param('id') userId: number
    ): Promise<UserDto>{
        return this.adminService.editUserById(userId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete user by id' })
    @Delete('users/{:id}')
    deleteUserById(@Param('id') userId: number){
        return this.adminService.deleteUserById(userId);
    }
    
}
