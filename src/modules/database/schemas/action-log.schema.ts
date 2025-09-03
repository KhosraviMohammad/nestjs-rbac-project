import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActionLogDocument = ActionLog & Document;

@Schema({ timestamps: true })
export class ActionLog {
  @Prop({ required: true })
  actionType: string; // e.g., 'login', 'register', 'create_user', 'update_user', 'delete_user'

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  success: boolean;

  @Prop({ type: Object })
  inputData: any; // The data that was sent to the service/controller

  @Prop({ type: Object })
  outputData: any; // The response from the service/controller

  @Prop()
  errorMessage: string;

  @Prop()
  errorCode: string;

  @Prop()
  resourceId: string; // ID of the resource being acted upon (if applicable)

  @Prop()
  resourceType: string; // Type of resource (e.g., 'user', 'role', 'permission')

  @Prop()
  duration: number; // in milliseconds

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ActionLogSchema = SchemaFactory.createForClass(ActionLog);

// Create indexes for better performance
ActionLogSchema.index({ userId: 1, timestamp: -1 });
ActionLogSchema.index({ actionType: 1, timestamp: -1 });
ActionLogSchema.index({ username: 1, timestamp: -1 });
ActionLogSchema.index({ success: 1, timestamp: -1 });
ActionLogSchema.index({ resourceType: 1, resourceId: 1 });
