import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  actionType: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ required: true })
  resourceId: string;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  success: boolean;

  @Prop({ type: Object })
  requestData: any;

  @Prop({ type: Object })
  responseData: any;

  @Prop()
  errorMessage: string;

  @Prop()
  errorCode: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  endpoint: string;

  @Prop()
  duration: number; // in milliseconds

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Create indexes for better performance
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ actionType: 1, timestamp: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
AuditLogSchema.index({ success: 1, timestamp: -1 });
