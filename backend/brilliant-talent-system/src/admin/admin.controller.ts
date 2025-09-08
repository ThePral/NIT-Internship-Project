import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminJwtGuard, AnyAdminJwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { AdminDto, AdminWithRoleDto, EditAdminDto, UploadResponseDto } from './dto';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { EditUserByAdminDto, UserDto } from 'src/user/dto/user.dto';
import { ExcelUploadDecorator } from './decorators';
import { QueueService } from 'src/queue/queue.service';

@ApiBearerAuth('access_token')
@UseGuards(AnyAdminJwtGuard)
@Controller('admins')
export class AdminController {
    constructor(private adminService: AdminService, private readonly queueService: QueueService) {}
    
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
    editMe(@GetUser() admin: Admin, @Body() dto: EditAdminDto): Promise<AdminDto>{
        return this.adminService.editAdmin(admin, dto);
    }

    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({ type: UserDto, isArray: true })
    @Get('users')
    getUsers(): Promise<UserDto[]>{
        return this.adminService.getUsers();
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ type: UserDto })
    @Get('users/:id')
    getUserById(@Param('id') userId: number): Promise<UserDto>{
        return this.adminService.getUserById(userId);
    }

    @ApiOperation({ summary: 'Edit user by id' })
    @ApiBody({ type: EditUserByAdminDto })
    @ApiResponse({ type: UserDto })
    @Patch('users/:id')
    editUserById(
        @Body() dto: EditUserByAdminDto,
        @Param('id') userId: number
    ): Promise<UserDto>{
        return this.adminService.editUserById(userId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete user by id' })
    @Delete('users/:id')
    deleteUserById(@Param('id') userId: number){
        return this.adminService.deleteUserById(userId);
    }


    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: "upload Excel files" })
    @ExcelUploadDecorator('file')
    @ApiOkResponse( { type: UploadResponseDto})
    @Post("upload/:type")
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Param('type') type: string) {
        
        const job = await this.queueService.importQueue.add('import', {
            path: file.path,
            filename: file.filename,
            type,
            uploadedBy: 'admin', 
        });

        return {
            message: 'File uploaded — import queued',
            jobId: job.id,
        };
    }

    @ApiOperation({ summary: "Allocates Users Minor Acceptance" })
    @Post("allocation/run")
    async caclulateUserAcceptance() {
        return await this.adminService.allocateUserAcceptances();
    }

    @Get("results/pdf/sr0")
    async generateSr0PDF() {
        return this.adminService.buildSr0();
    }

    @Get("results/pdf/sr4")
    async generateSr4PDF() {
        return this.adminService.buildSr4();
    }
    
}
