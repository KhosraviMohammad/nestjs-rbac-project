import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface AuditLogData {
  action: string;
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

  async getLogsByUser(userId: number, limit: number = 50, skip: number = 0) {
    return this.auditLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByAction(action: string, limit: number = 50, skip: number = 0) {
    return this.auditLogModel
      .find({ action })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByResource(resource: string, resourceId: string, limit: number = 50, skip: number = 0) {
    return this.auditLogModel
      .find({ resource, resourceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getFailedLogs(limit: number = 50, skip: number = 0) {
    return this.auditLogModel
      .find({ success: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100, skip: number = 0) {
    return this.auditLogModel
      .find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsStats() {
    const totalLogs = await this.auditLogModel.countDocuments();
    const successLogs = await this.auditLogModel.countDocuments({ success: true });
    const failedLogs = await this.auditLogModel.countDocuments({ success: false });
    
    const actionStats = await this.auditLogModel.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const userStats = await this.auditLogModel.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      totalLogs,
      successLogs,
      failedLogs,
      successRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
      actionStats,
      topUsers: userStats,
    };
  }
}
