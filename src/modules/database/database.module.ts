import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainDatabaseService } from './database.service';
import { MongoDBService } from './mongodb.service';
import { AuditLogService } from './audit-log.service';
import { ActionLogService } from './action-log.service';
import { AuditLogController } from './audit-log.controller';
import { ActionLogController } from './action-log.controller';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { ActionLog, ActionLogSchema } from './schemas/action-log.schema';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: ActionLog.name, schema: ActionLogSchema },
    ]),
  ],
  controllers: [AuditLogController, ActionLogController],
  providers: [MainDatabaseService, MongoDBService, AuditLogService, ActionLogService, AuditLogInterceptor],
  exports: [MainDatabaseService, MongoDBService, AuditLogService, ActionLogService, AuditLogInterceptor],
})
export class DatabaseModule {}
