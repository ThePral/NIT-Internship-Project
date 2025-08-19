import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminJwtGuard, AnyAdminJwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { AdminDto, AdminWithRoleDto, EditAdminDto } from './dto';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { EditUserDto, UserDto } from 'src/user/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename } from 'path';

@ApiBearerAuth('access_token')
@UseGuards(AnyAdminJwtGuard)
@Controller('admins')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @UseGuards(AdminJwtGuard)
    @ApiOperation({ summary: 'Get me' })
    @ApiResponse({ type: AdminWithRoleDto })
    @Get('me')
    getMe(@GetUser() admin: Admin): AdminWithRoleDto{
        const { hash_password, ...safeAdmin} = admin;
        return {...safeAdmin , role : "admin"};
    }

    @UseGuards(AdminJwtGuard)
    @ApiOperation({ summary: 'Edit me' })
    @ApiBody({ type: EditAdminDto })
    @ApiResponse({ type: AdminDto })
    @Patch('me')
    ediAdmin(@GetUser() admin: Admin, @Body() dto: EditAdminDto): Promise<AdminDto>{
        return this.adminService.editAdmin(admin, dto);
    }

    // @ApiOperation({ summary: 'Add user' })
    // @ApiBody({ type: CreateUserDto })
    // @ApiResponse({ type: UserDto })
    // @Post('users')
    // addUser(@Body() dto: CreateUserDto): Promise<UserDto>{
    //     return this.adminService.addUser(dto);
    // }

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

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                // create unique filename: originalname + timestamp
                const originalName = basename(file.originalname);
                callback(null, originalName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                return callback(new Error('Only Excel files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    @ApiConsumes('multipart/form-data')
    @Post("/upload")
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                type: 'string',
                format: 'binary',
                },
            },
        },
    })
    uploadExcel(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'File uploaded successfully!',
            filename: file.filename,
            path: file.path,
        };
    }
    
}
