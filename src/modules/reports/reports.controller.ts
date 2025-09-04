import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-registrations')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get daily registrations report (Admin and Support)' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to report (default: 30)' })
  @ApiResponse({ status: 200, description: 'Daily registrations report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async getDailyRegistrations(
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
  ) {
    return this.reportsService.getDailyRegistrationsReport(days);
  }

  @Get('login-success-rate')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get login success rate report (Admin and Support)' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to report (default: 30)' })
  @ApiResponse({ status: 200, description: 'Login success rate report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async getLoginSuccessRate(
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
  ) {
    return this.reportsService.getLoginSuccessRateReport(days);
  }

  @Get('error-distribution')
  @Roles('admin', 'support')
  @ApiOperation({ summary: 'Get error distribution report (Admin and Support)' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to report (default: 30)' })
  @ApiResponse({ status: 200, description: 'Error distribution report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Support role required' })
  async getErrorDistribution(
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
  ) {
    return this.reportsService.getErrorDistributionReport(days);
  }
}
