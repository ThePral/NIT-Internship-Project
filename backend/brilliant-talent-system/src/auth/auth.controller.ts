import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, TokenDto, SuperAdminLoginDto, AdminLoginDto } from "./dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: UserLoginDto })
    @ApiResponse({ type: TokenDto })
    @Post('user')
    userlogin(@Body() dto: UserLoginDto): Promise<TokenDto> {
        return this.authService.userLogin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    @ApiBody({ type: AdminLoginDto })
    @ApiResponse({ type: TokenDto })
    @Post('admin')
    adminlogin(@Body() dto: AdminLoginDto): Promise<TokenDto> {
        return this.authService.adminLogin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'SuperAdmin login' })
    @ApiBody({ type: SuperAdminLoginDto })
    @ApiResponse({ type: TokenDto })
    @Post('superAdmin')
    superAdminlogin(@Body() dto: SuperAdminLoginDto): Promise<TokenDto> {
        return this.authService.superAdminLogin(dto);
    }
}