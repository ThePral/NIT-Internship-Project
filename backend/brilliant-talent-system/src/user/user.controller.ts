import { Controller, Get, UseGuards, Patch, Body, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { EditUserDto, UserDto, UserWithRoleDto } from './dto';
import { UserJwtGuard } from 'src/auth/guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AllocationService } from 'src/admissions/allocation.service';
import { StudentResultDto } from './dto/resultResponse.dto';

@ApiBearerAuth('access_token')
@UseGuards(UserJwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly allocationService: AllocationService,
  ) {}

  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ type: UserWithRoleDto })
  @Get('me')
  getMe(@GetUser() user: User): UserWithRoleDto {
    const { hash_password, ...safeUser } = user;
    return { ...safeUser, role: 'user' };
  }

  @ApiOperation({ summary: 'Edit me' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({ type: UserDto })
  @Patch('me')
  editMe(@GetUser() user: User, @Body() dto: EditUserDto): Promise<UserDto> {
    return this.userService.editUser(user, dto);
  }

  @ApiOperation({ summary: 'Get results' })
  @ApiResponse({
    status: 200,
    description: 'Full allocation result',
    type: StudentResultDto,
  })
  @Get('result')
  async getStudentResult(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.allocationService.getStudentResult(userId);
  }
}
