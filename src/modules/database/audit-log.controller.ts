import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Audit Logs')
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get audit logs with basic filters (Admin and Support)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of logs to return (default: 50)' })
  @ApiQuery({ name: 'skip', required: false, description: 'Number of logs to skip (default: 0)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async getLogs(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
  ) {
    // This is a placeholder - you can implement basic audit log retrieval here
    return { message: 'Audit logs endpoint - implement as needed' };
  }
}