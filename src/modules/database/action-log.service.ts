import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionLog, ActionLogDocument } from './schemas/action-log.schema';

export interface ActionLogData {
  actionType: string;
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  inputData?: any;
  outputData?: any;
  errorMessage?: string;
  errorCode?: string;
  resourceId?: string;
  resourceType?: string;
  duration?: number;
}

@Injectable()
export class ActionLogService {
  constructor(
    @InjectModel(ActionLog.name) private actionLogModel: Model<ActionLogDocument>,
  ) {}

  async log(data: ActionLogData): Promise<ActionLogDocument> {
    try {
      const actionLog = new this.actionLogModel({
        ...data,
        timestamp: new Date(),
      });
      return await actionLog.save();
    } catch (error) {
      console.error('Failed to save action log:', error);
      throw error;
    }
  }

  async getLogsByUser(userId: number, limit: number = 50, skip: number = 0) {
    return this.actionLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByActionType(actionType: string, limit: number = 50, skip: number = 0) {
    return this.actionLogModel
      .find({ actionType })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByUsername(username: string, limit: number = 50, skip: number = 0) {
    return this.actionLogModel
      .find({ username })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByResource(resourceType: string, resourceId: string, limit: number = 50, skip: number = 0) {
    return this.actionLogModel
      .find({ resourceType, resourceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getFailedLogs(limit: number = 50, skip: number = 0) {
    return this.actionLogModel
      .find({ success: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100, skip: number = 0) {
    return this.actionLogModel
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
    const totalLogs = await this.actionLogModel.countDocuments();
    const successLogs = await this.actionLogModel.countDocuments({ success: true });
    const failedLogs = await this.actionLogModel.countDocuments({ success: false });
    
    const actionTypeStats = await this.actionLogModel.aggregate([
      {
        $group: {
          _id: '$actionType',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const userStats = await this.actionLogModel.aggregate([
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const resourceStats = await this.actionLogModel.aggregate([
      {
        $group: {
          _id: '$resourceType',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      totalLogs,
      successLogs,
      failedLogs,
      successRate: totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0,
      actionTypeStats,
      topUsers: userStats,
      resourceStats,
    };
  }
}
