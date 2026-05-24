jest.mock('./admin.service', () => ({
  AdminService: class AdminService {},
}));

jest.mock('src/auth/guard', () => ({
  AdminJwtGuard: class AdminJwtGuard {},
  AnyAdminJwtGuard: class AnyAdminJwtGuard {},
}));

jest.mock('src/auth/decorator', () => ({
  GetUser: () => () => undefined,
}));

jest.mock('src/queue/queue.service', () => ({
  QueueService: class QueueService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { QueueService } from 'src/queue/queue.service';
import type { EditUserByAdminDto } from 'src/user/dto/user.dto';
import { EditAdminDto } from './dto';

type MockAdmin = {
  id: number;
  username: string;
  hash_password: string;
  createdAt: Date;
  updatedAt: Date;
};

describe('AdminController', () => {
  let controller: AdminController;

  const mockAdminService = {
    editAdmin: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    editUserById: jest.fn(),
    deleteUserById: jest.fn(),
  };

  const mockQueueService = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admins/me', () => {
    it('should return the current admin without hash_password and with role admin', () => {
      const admin: MockAdmin = {
        id: 1,
        username: 'admin_user',
        hash_password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = controller.getMe(admin as any);

      expect(result).toEqual({
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        role: 'admin',
      });

      expect(result).not.toHaveProperty('hash_password');
    });
  });

  describe('PATCH /admins/me', () => {
    it('should call adminService.editAdmin with current admin and dto', async () => {
      const admin: MockAdmin = {
        id: 1,
        username: 'old_admin',
        hash_password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: EditAdminDto = {
        username: 'new_admin',
      };

      const updatedAdmin = {
        id: 1,
        username: 'new_admin',
        createdAt: admin.createdAt,
        updatedAt: new Date(),
      };

      mockAdminService.editAdmin.mockResolvedValue(updatedAdmin);

      await expect(controller.editMe(admin as any, dto)).resolves.toEqual(
        updatedAdmin,
      );

      expect(mockAdminService.editAdmin).toHaveBeenCalledTimes(1);
      expect(mockAdminService.editAdmin).toHaveBeenCalledWith(admin, dto);
    });
  });

  describe('GET /admins/users', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          username: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAdminService.getUsers.mockResolvedValue(users);

      await expect(controller.getUsers()).resolves.toEqual(users);

      expect(mockAdminService.getUsers).toHaveBeenCalledTimes(1);
      expect(mockAdminService.getUsers).toHaveBeenCalledWith();
    });
  });

  describe('GET /admins/users/:id', () => {
    it('should return a user by id', async () => {
      const userId = 1;

      const user = {
        id: userId,
        username: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAdminService.getUserById.mockResolvedValue(user);

      await expect(controller.getUserById(userId)).resolves.toEqual(user);

      expect(mockAdminService.getUserById).toHaveBeenCalledTimes(1);
      expect(mockAdminService.getUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('PATCH /admins/users/:id', () => {
    it('should edit a user by id', async () => {
      const userId = 1;

      const dto = {
        username: 'updated_user',
      } as EditUserByAdminDto;

      const updatedUser = {
        id: userId,
        username: 'updated_user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAdminService.editUserById.mockResolvedValue(updatedUser);

      await expect(controller.editUserById(dto, userId)).resolves.toEqual(
        updatedUser,
      );

      expect(mockAdminService.editUserById).toHaveBeenCalledTimes(1);
      expect(mockAdminService.editUserById).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('DELETE /admins/users/:id', () => {
    it('should delete a user by id', async () => {
      const userId = 1;

      mockAdminService.deleteUserById.mockResolvedValue(undefined);

      await expect(controller.deleteUserById(userId)).resolves.toBeUndefined();

      expect(mockAdminService.deleteUserById).toHaveBeenCalledTimes(1);
      expect(mockAdminService.deleteUserById).toHaveBeenCalledWith(userId);
    });
  });
});
