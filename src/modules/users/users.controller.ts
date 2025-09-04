import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ActionLogService } from '../database/action-log.service';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly actionLogService: ActionLogService,
  ) {}

  @Get()
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get all users (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email or username already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const startTime = Date.now();
    try {
      const result = await this.usersService.create(createUserDto);
      
      // Log successful user creation action
      await this.actionLogService.log({
        actionType: 'create_user',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: true,
        inputData: { 
          username: createUserDto.username,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: createUserDto.role || 'user'
        },
        outputData: { createdUserId: result.id },
        resourceType: 'user',
        resourceId: result.id.toString(),
        duration: Date.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log failed user creation action
      await this.actionLogService.log({
        actionType: 'create_user',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: false,
        inputData: { 
          username: createUserDto.username,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: createUserDto.role || 'user'
        },
        errorMessage: error.message,
        errorCode: error.status?.toString() || '500',
        duration: Date.now() - startTime,
      });
      
      throw error;
    }
  }

  @Post(':id/lock')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Lock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account locked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async lockUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const startTime = Date.now();
    try {
      const result = await this.usersService.lockUser(id);
      
      // Log successful lock action
      await this.actionLogService.log({
        actionType: 'lock_user',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: true,
        inputData: { targetUserId: id },
        outputData: { lockedUserId: id },
        resourceType: 'user',
        resourceId: id.toString(),
        duration: Date.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log failed lock action
      await this.actionLogService.log({
        actionType: 'lock_user',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: false,
        inputData: { targetUserId: id },
        errorMessage: error.message,
        errorCode: error.status?.toString() || '500',
        resourceType: 'user',
        resourceId: id.toString(),
        duration: Date.now() - startTime,
      });
      
      throw error;
    }
  }

  @Post(':id/unlock')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Unlock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account unlocked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  unlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unlockUser(id);
  }

  @Patch(':id/role')
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
    const startTime = Date.now();
    try {
      const result = await this.usersService.changeUserRole(id, changeRoleDto.role);
      
      // Log successful role change action
      await this.actionLogService.log({
        actionType: 'change_user_role',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: true,
        inputData: { targetUserId: id, newRole: changeRoleDto.role },
        outputData: { changedUserId: id, newRole: changeRoleDto.role },
        resourceType: 'user',
        resourceId: id.toString(),
        duration: Date.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log failed role change action
      await this.actionLogService.log({
        actionType: 'change_user_role',
        userId: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userRole: req.user.roles?.[0]?.role?.name || 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        success: false,
        inputData: { targetUserId: id, newRole: changeRoleDto.role },
        errorMessage: error.message,
        errorCode: error.status?.toString() || '500',
        resourceType: 'user',
        resourceId: id.toString(),
        duration: Date.now() - startTime,
      });
      
      throw error;
    }
  }
}