import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../database/schemas/audit-log.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  // Daily Registrations Report
  async getDailyRegistrationsReport(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyRegistrations = await this.auditLogModel.aggregate([
      {
        $match: {
          actionType: 'user_registration',
          success: true,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const totalRegistrations = await this.auditLogModel.countDocuments({
      actionType: 'user_registration',
      success: true,
      timestamp: { $gte: startDate }
    });

    const averageDaily = totalRegistrations / days;

    return {
      period: `${days} days`,
      totalRegistrations,
      averageDaily: Math.round(averageDaily * 100) / 100,
      dailyBreakdown: dailyRegistrations.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        count: item.count
      }))
    };
  }

  // Login Success Rate Report
  async getLoginSuccessRateReport(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const loginStats = await this.auditLogModel.aggregate([
      {
        $match: {
          actionType: 'user_login',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          successfulLogins: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          failedLogins: {
            $sum: { $cond: ['$success', 0, 1] }
          }
        }
      }
    ]);

    const dailyLoginStats = await this.auditLogModel.aggregate([
      {
        $match: {
          actionType: 'user_login',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          totalAttempts: { $sum: 1 },
          successfulLogins: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$successfulLogins', '$totalAttempts'] },
              100
            ]
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const stats = loginStats[0] || { totalAttempts: 0, successfulLogins: 0, failedLogins: 0 };
    const successRate = stats.totalAttempts > 0 
      ? Math.round((stats.successfulLogins / stats.totalAttempts) * 100 * 100) / 100 
      : 0;

    return {
      period: `${days} days`,
      totalAttempts: stats.totalAttempts,
      successfulLogins: stats.successfulLogins,
      failedLogins: stats.failedLogins,
      overallSuccessRate: successRate,
      dailyBreakdown: dailyLoginStats.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        totalAttempts: item.totalAttempts,
        successfulLogins: item.successfulLogins,
        successRate: Math.round(item.successRate * 100) / 100
      }))
    };
  }

  // Error Distribution Report
  async getErrorDistributionReport(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const errorStats = await this.auditLogModel.aggregate([
      {
        $match: {
          success: false,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            actionType: '$actionType',
            errorCode: '$errorCode',
            endpoint: '$endpoint'
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalErrors = await this.auditLogModel.countDocuments({
      success: false,
      timestamp: { $gte: startDate }
    });

    const errorByActionType = await this.auditLogModel.aggregate([
      {
        $match: {
          success: false,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$actionType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const errorByEndpoint = await this.auditLogModel.aggregate([
      {
        $match: {
          success: false,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$endpoint',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      { $limit: 10 }
    ]);

    return {
      period: `${days} days`,
      totalErrors,
      errorDistribution: errorStats.map(item => ({
        actionType: item._id.actionType,
        errorCode: item._id.errorCode || 'Unknown',
        endpoint: item._id.endpoint,
        count: item.count,
        uniqueUsers: item.uniqueUserCount,
        percentage: Math.round((item.count / totalErrors) * 100 * 100) / 100
      })),
      errorByActionType: errorByActionType.map(item => ({
        actionType: item._id,
        count: item.count,
        percentage: Math.round((item.count / totalErrors) * 100 * 100) / 100
      })),
      topErrorEndpoints: errorByEndpoint.map(item => ({
        endpoint: item._id,
        count: item.count,
        percentage: Math.round((item.count / totalErrors) * 100 * 100) / 100
      }))
    };
  }
}
