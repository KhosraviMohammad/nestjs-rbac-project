import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/decorators/audit.decorator';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Audit('get_all_users')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get all users (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Audit('create_user')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email or username already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto);
  }

  @Post(':id/lock')
  @Audit('lock_user')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Lock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account locked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async lockUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.lockUser(id);
  }

  @Post(':id/unlock')
  @Audit('unlock_user')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Unlock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account unlocked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  unlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unlockUser(id);
  }

  @Patch(':id/role')
  @Audit('change_user_role')
  @Roles('admin')
  @ApiOperation({ summary: 'Change user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeRoleDto: ChangeRoleDto,
    @Request() req,
  ) {
    return this.usersService.changeUserRole(id, changeRoleDto.role);
  }
}