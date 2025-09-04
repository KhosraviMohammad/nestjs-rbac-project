import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

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
}