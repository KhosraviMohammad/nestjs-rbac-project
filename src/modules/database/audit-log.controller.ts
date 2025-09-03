import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Admin - Audit Logs')
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles('admin')
  @Permissions('audit:read')
  @ApiOperation({ summary: 'Get audit logs with filters (Admin only)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action' })
  @ApiQuery({ name: 'resource', required: false, description: 'Filter by resource' })
  @ApiQuery({ name: 'resourceId', required: false, description: 'Filter by resource ID' })
  @ApiQuery({ name: 'success', required: false, description: 'Filter by success status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return (default: 50)' })
  @ApiQuery({ name: 'skip', required: false, description: 'Number of logs to skip (default: 0)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('resource') resource?: string,
    @Query('resourceId') resourceId?: string,
    @Query('success') success?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
  ) {
    if (userId) {
      return this.auditLogService.getLogsByUser(parseInt(userId), limit, skip);
    }
    
    if (action) {
      return this.auditLogService.getLogsByAction(action, limit, skip);
    }
    
    if (resource && resourceId) {
      return this.auditLogService.getLogsByResource(resource, resourceId, limit, skip);
    }
    
    if (success === 'false') {
      return this.auditLogService.getFailedLogs(limit, skip);
    }
    
    // Default: return recent logs
    return this.auditLogService.getLogsByDateRange(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      new Date(),
      limit,
      skip
    );
  }

  @Get('stats')
  @Roles('admin')
  @Permissions('audit:read')
  @ApiOperation({ summary: 'Get audit logs statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Audit logs statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats() {
    return this.auditLogService.getLogsStats();
  }

  @Get('user/:userId')
  @Roles('admin')
  @Permissions('audit:read')
  @ApiOperation({ summary: 'Get audit logs for specific user (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return (default: 50)' })
  @ApiQuery({ name: 'skip', required: false, description: 'Number of logs to skip (default: 0)' })
  @ApiResponse({ status: 200, description: 'User audit logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getUserLogs(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
  ) {
    return this.auditLogService.getLogsByUser(userId, limit, skip);
  }

  @Get('failed')
  @Roles('admin')
  @Permissions('audit:read')
  @ApiOperation({ summary: 'Get failed audit logs (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return (default: 50)' })
  @ApiQuery({ name: 'skip', required: false, description: 'Number of logs to skip (default: 0)' })
  @ApiResponse({ status: 200, description: 'Failed audit logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getFailedLogs(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
  ) {
    return this.auditLogService.getFailedLogs(limit, skip);
  }
}
