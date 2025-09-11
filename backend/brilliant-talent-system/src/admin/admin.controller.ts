import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminJwtGuard, AnyAdminJwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { AdminDto, AdminWithRoleDto, EditAdminDto, UploadResponseDto, PresenceResult, userResults } from './dto';
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


    @ApiOperation({ summary: "upload Excel files" })
    @ExcelUploadDecorator('file')
    // @ApiOkResponse( { type: UploadResponseDto})
    @Post("upload/:type")
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'File uploaded succesfully',
            path: file.path,
            filename: file.filename,
        };
    }

    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: "Import Excels Data to DB" })
    @ApiOkResponse( { type: UploadResponseDto})
    @Post("excels")
    async submitExcelsData() {
        return this.adminService.importDocs();
    }

    @ApiOperation({ summary: 'Get Excel Files Existance' })
    @ApiResponse({ type: PresenceResult })
    @Get("excels")
    getExcelsExistance() {
        return this.adminService.listExcelPresence();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletes Excel Files' })
    @Delete("excels")
    deleteExcels() {
        return this.adminService.deleteDocs();
    }

    @ApiOperation({ summary: "Allocates Users Minor Acceptance" })
    @Post("allocation/run")
    async caclulateUserAcceptance() {
        return await this.adminService.allocateUserAcceptances();
    }

    @ApiOperation({ summary: "Get All Allocation Runs" })
    @Get("allocation/all")
    getAllocationRuns() {
        return this.adminService.allocationRunsData();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete Allocation Run By ID" })
    @Delete("allocation/:id")
    DeleteAllocationRunById(@Param('id', ParseIntPipe) runId: number) {
        return this.adminService.removeAllocationRunById(runId);
    }

    @ApiOperation({ summary: "Get Allocation Run Result By ID" })
    @Get("history/allocation/:id")
    getAllocationRunsHistory(@Param('id', ParseIntPipe) runId: number) {
        return this.adminService.allocationHistoryData(runId);
    }

    @ApiOperation({ summary: "Last allocations results"})
    @ApiResponse({ type: [userResults]})
    @Get("results/table")
    getResultsTable() {
        return this.adminService.userAcceptanceData();
    }

    @Get("results/pdf/sr0")
    async generateSr0PDF() {
        return this.adminService.buildSr0();
    }
    @Get("results/pdf/sr1")
    async generateSr1PDF() {
        return this.adminService.buildSr1();
    }
    @Get("results/pdf/sr2")
    async generateSr2PDF() {
        return this.adminService.buildSr2();
    }
    @Get("results/pdf/sr4")
    async generateSr4PDF() {
        return this.adminService.buildSr4();
    }
    
}
