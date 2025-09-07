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
  Res,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { CsvExportService } from './csv-export.service';
import { Response } from 'express';
import { handleAppError } from '../../common/utils/error-handler';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly csvExportService: CsvExportService,
  ) {}

  @Get()
  @Audit('get_all_users')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get all users with search, filter and pagination (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: PaginatedUsersDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  findAll(@Query() searchParams: SearchUsersDto): Promise<PaginatedUsersDto> {
    return this.usersService.findAll(searchParams);
  }

  @Get(':id')
  @Audit('get_user_detail')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get user by ID (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Get('export/csv')
  @Audit('export_users_csv')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Export users to CSV with search and filter (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async exportUsersToCsv(@Query() searchParams: SearchUsersDto, @Res() res: Response) {
    // For CSV export, we want all matching results, not paginated
    const exportParams = { ...searchParams };
    delete exportParams.page;
    delete exportParams.limit;
    
    const result = await this.usersService.findAll(exportParams);
    const csvContent = await this.csvExportService.exportUsersToCsvStream(result.data);
    
    // Create filename with filter info
    const filterSuffix = searchParams.search ? `-search-${searchParams.search}` : '';
    const roleSuffix = searchParams.roleType ? `-${searchParams.roleType}` : '';
    const filename = `users-export${filterSuffix}${roleSuffix}-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  }

  @Post()
  @Audit('create_user')
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or conflict' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Patch(':id')
  @Audit('update_user')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: any) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Post(':id/lock')
  @Audit('lock_user')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Lock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account locked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - User not found or already locked' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async lockUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      return await this.usersService.lockUser(id);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Post(':id/unlock')
  @Audit('unlock_user')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Unlock user account (Admin and Support)' })
  @ApiResponse({ status: 200, description: 'User account unlocked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - User not found or already unlocked' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async unlockUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.unlockUser(id);
    } catch (error) {
      handleAppError(error);
    }
  }

  @Patch(':id/role')
  @Audit('change_user_role')
  @Roles('admin')
  @ApiOperation({ summary: 'Change user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - User not found or invalid role type' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeRoleDto: ChangeRoleDto,
    @Request() req,
  ) {
    try {
      return await this.usersService.changeUserRole(id, changeRoleDto.roleType);
    } catch (error) {
      handleAppError(error);
    }
  }
}