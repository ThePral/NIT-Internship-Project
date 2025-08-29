import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuperAdminJwtGuard } from 'src/auth/guard';
import { SuperAdminService } from './superAdmin.service';
import { EditSuperAdminDto, SuperAdminDto, SuperAdminWithRoleDto } from './dto';
import { SuperAdmin } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { AdminDto, CreateAdminDto, EditAdminDto } from 'src/admin/dto';

@ApiBearerAuth('access_token')
@UseGuards(SuperAdminJwtGuard)
@Controller('superAdmins')
export class SuperAdminController {
    constructor(private superAdminService: SuperAdminService) {}

    // @ApiOperation({ summary: 'Add superAdmin' })
    // @ApiBody({ type: CreateSuperAdminDto })
    // @ApiResponse({ type: SuperAdminDto })
    // @Post('me')
    // addSuperAdmin(@Body() dto: CreateSuperAdminDto): Promise<SuperAdminDto>{
    //     return this.superAdminService.addSuperAdmin(dto);
    // }
    
    @ApiOperation({ summary: 'Get me' })
    @ApiResponse({ type: SuperAdminWithRoleDto })
    @Get('me')
    getMe(@GetUser() superAdmin: SuperAdmin): SuperAdminWithRoleDto{
        const { hash_password, ...safeSuperAdmin} = superAdmin;
        return {...safeSuperAdmin , role : "superAdmin"};
    }

    @ApiOperation({ summary: 'Edit me' })
    @ApiBody({ type: EditSuperAdminDto })
    @ApiResponse({ type: SuperAdminDto })
    @Patch('me')
    editMe(@GetUser() superAdmin: SuperAdmin, @Body() dto: EditSuperAdminDto): Promise<SuperAdminDto>{
        return this.superAdminService.editSuperAdmin(superAdmin, dto);
    }

    @ApiOperation({ summary: 'Add admin' })
    @ApiBody({ type: CreateAdminDto })
    @ApiResponse({ type: AdminDto })
    @Post('admins')
    addAdmin(@Body() dto: CreateAdminDto): Promise<AdminDto>{
        return this.superAdminService.addAdmin(dto);
    }

    @ApiOperation({ summary: 'Get admins' })
    @ApiResponse({ type: AdminDto, isArray: true })
    @Get('admins')
    getAdmins(): Promise<AdminDto[]>{
        return this.superAdminService.getAdmins();
    }

    @ApiOperation({ summary: 'Get admin by id' })
    @ApiResponse({ type: AdminDto })
    @Get('admins/:id')
    getAdminById(@Param('id') adminId: number): Promise<AdminDto>{
        return this.superAdminService.getAdminById(adminId);
    }

    @ApiOperation({ summary: 'Edit admin by id' })
    @ApiBody({ type: EditAdminDto })
    @ApiResponse({ type: AdminDto })
    @Patch('admins/:id')
    editAdminById(
        @Body() dto: EditAdminDto,
        @Param('id') adminId: number
    ): Promise<AdminDto>{
        return this.superAdminService.editAdminById(adminId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete admin by id' })
    @Delete('admins/:id')
    deleteAdminById(@Param('id') adminId: number){
        return this.superAdminService.deleteAdminById(adminId);
    }

}
