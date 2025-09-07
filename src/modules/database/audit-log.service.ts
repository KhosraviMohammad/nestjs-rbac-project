import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { PaginatedAuditLogsDto } from './dto/audit-log-response.dto';

export interface AuditLogData {
  action: string;
  actionType: string;
  resource: string;
  resourceId: string;
  userId: number;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  requestData?: any;
  responseData?: any;
  errorMessage?: string;
  errorCode?: string;
  method: string;
  endpoint: string;
  duration?: number;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(data: AuditLogData): Promise<AuditLogDocument> {
    try {
      const auditLog = new this.auditLogModel({
        ...data,
        timestamp: new Date(),
      });
      return await auditLog.save();
    } catch (error) {
      console.error('Failed to save audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(query: AuditLogQueryDto): Promise<PaginatedAuditLogsDto> {
    const {
      search,
      actionType,
      resource,
      userRole,
      success,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = query;

    // Build filter object
    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { action: { $regex: search, $options: 'i' } },
        { resource: { $regex: search, $options: 'i' } },
        { userRole: { $regex: search, $options: 'i' } },
        { method: { $regex: search, $options: 'i' } },
        { endpoint: { $regex: search, $options: 'i' } },
      ];
    }

    // Specific filters
    if (actionType) {
      filter.actionType = actionType;
    }

    if (resource) {
      filter.resource = resource;
    }

    if (userRole) {
      filter.userRole = userRole;
    }

    if (success !== undefined) {
      filter.success = success;
    }

    // Date filters
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999); // End of day
        filter.timestamp.$lte = endDateTime;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await this.auditLogModel.countDocuments(filter);

    // Get audit logs
    const auditLogs = await this.auditLogModel
      .find(filter)
      .sort({ timestamp: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: auditLogs as any,
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };
  }
}