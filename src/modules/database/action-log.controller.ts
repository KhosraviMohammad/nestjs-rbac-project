import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActionLogService } from './action-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Admin - Action Logs')
@Controller('admin/action-logs')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class ActionLogController {
  constructor(private readonly actionLogService: ActionLogService) {}

  @Get()
  @Roles('admin')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get action logs with pagination' })
  @ApiResponse({ status: 200, description: 'Action logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of logs to skip' })
  async getActionLogs(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.actionLogService.getLogsByDateRange(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      new Date(),
      limit,
      skip,
    );
  }

  @Get('stats')
  @Roles('admin')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get action logs statistics' })
  @ApiResponse({ status: 200, description: 'Action logs statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getActionLogStats() {
    return this.actionLogService.getLogsStats();
  }

  @Get('by-user/:userId')
  @Roles('admin')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get action logs by user ID' })
  @ApiResponse({ status: 200, description: 'User action logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of logs to skip' })
  async getLogsByUser(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.actionLogService.getLogsByUser(userId, limit, skip);
  }

  @Get('by-action/:actionType')
  @Roles('admin')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get action logs by action type' })
  @ApiResponse({ status: 200, description: 'Action logs by type retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of logs to skip' })
  async getLogsByActionType(
    @Query('actionType') actionType: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.actionLogService.getLogsByActionType(actionType, limit, skip);
  }

  @Get('failed')
  @Roles('admin')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get failed action logs' })
  @ApiResponse({ status: 200, description: 'Failed action logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of logs to return' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of logs to skip' })
  async getFailedLogs(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.actionLogService.getFailedLogs(limit, skip);
  }
}
