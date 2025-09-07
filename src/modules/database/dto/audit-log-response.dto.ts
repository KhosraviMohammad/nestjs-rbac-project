import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'get_users' })
  action: string;

  @ApiProperty({ example: 'READ' })
  actionType: string;

  @ApiProperty({ example: 'users' })
  resource: string;

  @ApiProperty({ example: 'list' })
  resourceId: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'admin' })
  userRole: string;

  @ApiProperty({ example: '192.168.1.1' })
  ipAddress: string;

  @ApiProperty({ example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' })
  userAgent: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: { page: 1, limit: 10 } })
  requestData?: any;

  @ApiProperty({ example: { data: [], meta: { total: 0 } } })
  responseData?: any;

  @ApiProperty({ example: 'User not found' })
  errorMessage?: string;

  @ApiProperty({ example: 'USER_NOT_FOUND' })
  errorCode?: string;

  @ApiProperty({ example: 'GET' })
  method: string;

  @ApiProperty({ example: '/api/v1/users' })
  endpoint: string;

  @ApiProperty({ example: 150 })
  duration?: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PaginatedAuditLogsDto {
  @ApiProperty({ type: [AuditLogResponseDto] })
  data: AuditLogResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 50 })
  limit: number;

  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrev: boolean;
}
