import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminJwtGuard, AnyAdminJwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { AdminDto, AdminWithRoleDto, EditAdminDto, UploadResponseDto } from './dto';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { EditUserDto, UserDto } from 'src/user/dto/user.dto';
import { ExcelUploadDecorator } from './decorators';
import fs from "fs";

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
    editMe(@GetUser() admin: Admin, @Body() dto: EditAdminDto): Promise<AdminDto>{
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
    @Get('users/:id')
    getUserById(@Param('id') userId: number): Promise<UserDto>{
        return this.adminService.getUserById(userId);
    }

    @ApiOperation({ summary: 'Edit user by id' })
    @ApiBody({ type: EditUserDto })
    @ApiResponse({ type: UserDto })
    @Patch('users/:id')
    editUserById(
        @Body() dto: EditUserDto,
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

    @ApiOperation({ summary: "upload Excel files" })
    @ExcelUploadDecorator('file')
    @ApiOkResponse( { type: UploadResponseDto})
    @Post("upload/:type")
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Param('type') type: string) {
        const result = await this.adminService.importDocs(file.path, type);
        return {
            result,
            filename: file.filename,
            path: file.path,
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
        // const outHtml = './tmp/sr0.html';
        // const outPdf = './tmp/sr0.pdf';
        // await this.adminService.srPdfService.generateSr0(outHtml, outPdf, 'Vazir', { regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }, runId ? Number(runId) : undefined);
        // res.headers.set('Content-Type', 'application/pdf');
        // res.headers.set('Content-Disposition', 'attachment; filename="sr0.pdf"');
        // const stream = fs.createReadStream(outPdf);
        // stream.pipe(res);
    }
    
}
