jest.mock('./auth.service', () => ({
  AuthService: class AuthService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type {
  AdminLoginDto,
  RefreshTokenDto,
  SuperAdminLoginDto,
  TokensDto,
  UserLoginDto,
} from './dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    userLogin: jest.fn(),
    adminLogin: jest.fn(),
    superAdminLogin: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/user', () => {
    it('should call authService.userLogin with dto and return tokens', async () => {
      const dto: UserLoginDto = {
        username: 'test_user',
        password: 'test_password',
      };

      const tokens: TokensDto = {
        access_token: 'mock-user-access-token',
        refresh_token: 'mock-user-refresh-token',
      };

      mockAuthService.userLogin.mockResolvedValue(tokens);

      await expect(controller.userlogin(dto)).resolves.toEqual(tokens);

      expect(mockAuthService.userLogin).toHaveBeenCalledTimes(1);
      expect(mockAuthService.userLogin).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/admin', () => {
    it('should call authService.adminLogin with dto and return tokens', async () => {
      const dto: AdminLoginDto = {
        username: 'admin_user',
        password: 'admin_password',
      };

      const tokens: TokensDto = {
        access_token: 'mock-admin-access-token',
        refresh_token: 'mock-admin-refresh-token',
      };

      mockAuthService.adminLogin.mockResolvedValue(tokens);

      await expect(controller.adminlogin(dto)).resolves.toEqual(tokens);

      expect(mockAuthService.adminLogin).toHaveBeenCalledTimes(1);
      expect(mockAuthService.adminLogin).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/superAdmin', () => {
    it('should call authService.superAdminLogin with dto and return tokens', async () => {
      const dto: SuperAdminLoginDto = {
        username: 'super_admin_user',
        password: 'super_admin_password',
      };

      const tokens: TokensDto = {
        access_token: 'mock-super-admin-access-token',
        refresh_token: 'mock-super-admin-refresh-token',
      };

      mockAuthService.superAdminLogin.mockResolvedValue(tokens);

      await expect(controller.superAdminlogin(dto)).resolves.toEqual(tokens);

      expect(mockAuthService.superAdminLogin).toHaveBeenCalledTimes(1);
      expect(mockAuthService.superAdminLogin).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/refreshTokens', () => {
    it('should call authService.refreshTokens with refresh_token and return tokens', async () => {
      const dto: RefreshTokenDto = {
        refresh_token: 'old-refresh-token',
      };

      const tokens: TokensDto = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(tokens);

      await expect(controller.refreshTokens(dto)).resolves.toEqual(tokens);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledTimes(1);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        dto.refresh_token,
      );
    });
  });
});
