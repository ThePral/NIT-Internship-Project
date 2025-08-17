import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, TokensDto, SuperAdminLoginDto, AdminLoginDto, RefreshTokenDto } from "./dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: UserLoginDto })
    @ApiResponse({ type: TokensDto })
    @Post('user')
    userlogin(@Body() dto: UserLoginDto): Promise<TokensDto> {
        return this.authService.userLogin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    @ApiBody({ type: AdminLoginDto })
    @ApiResponse({ type: TokensDto })
    @Post('admin')
    adminlogin(@Body() dto: AdminLoginDto): Promise<TokensDto> {
        return this.authService.adminLogin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'SuperAdmin login' })
    @ApiBody({ type: SuperAdminLoginDto })
    @ApiResponse({ type: TokensDto })
    @Post('superAdmin')
    superAdminlogin(@Body() dto: SuperAdminLoginDto): Promise<TokensDto> {
        return this.authService.superAdminLogin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ type: TokensDto })
    @Post('refreshTokens')
    refreshTokens(@Body() refreshToken: RefreshTokenDto): Promise<TokensDto> {
        return this.authService.refreshTokens(refreshToken.refresh_token);
    }
}