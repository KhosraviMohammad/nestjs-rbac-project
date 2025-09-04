import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../../modules/database/audit-log.service';
import { AUDIT_KEY } from '../decorators/audit.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const user = request.user;

    // Get action type from decorator
    const actionType = this.reflector.get<string>(AUDIT_KEY, context.getHandler()) || 
                      this.reflector.get<string>(AUDIT_KEY, context.getClass()) ||
                      this.extractAction(method);

    // Extract resource and action from the request
    const resource = this.extractResource(url, method);
    const action = this.extractAction(method);
    const resourceId = this.extractResourceId(url);

    return next.handle().pipe(
      tap((data) => {
        // Log successful request
        this.logAudit({
          action,
          actionType,
          resource,
          resourceId,
          userId: user?.id || 0,
          userRole: user?.roleType || 'guest',
          ipAddress: ip,
          userAgent,
          success: true,
          requestData: this.sanitizeRequestData(request.body),
          responseData: this.sanitizeResponseData(data),
          method,
          endpoint: url,
          duration: Date.now() - startTime,
        });
      }),
      catchError((error) => {
        // Log failed request
        this.logAudit({
          action,
          actionType,
          resource,
          resourceId,
          userId: user?.id || 0,
          userRole: user?.roleType || 'guest',
          ipAddress: ip,
          userAgent,
          success: false,
          requestData: this.sanitizeRequestData(request.body),
          responseData: null,
          errorMessage: error.message,
          errorCode: error.status?.toString() || '500',
          method,
          endpoint: url,
          duration: Date.now() - startTime,
        });

        return throwError(() => error);
      }),
    );
  }

  private extractResource(url: string, method: string): string {
    // Extract resource from URL path
    const pathSegments = url.split('/').filter(segment => segment && !segment.match(/^\d+$/));
    
    if (pathSegments.length === 0) return 'root';
    
    // Remove 'admin' prefix if present
    if (pathSegments[0] === 'admin' && pathSegments.length > 1) {
      return pathSegments[1];
    }
    
    return pathSegments[0];
  }

  private extractAction(method: string): string {
    const actionMap = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };
    
    return actionMap[method] || 'unknown';
  }

  private extractResourceId(url: string): string {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    
    // Check if last segment is a number (ID)
    if (lastSegment && lastSegment.match(/^\d+$/)) {
      return lastSegment;
    }
    
    // Check for ID in path like /users/123/lock
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i] && segments[i].match(/^\d+$/)) {
        return segments[i];
      }
    }
    
    return 'unknown';
  }

  private sanitizeRequestData(data: any): any {
    if (!data) return null;
    
    // Remove sensitive fields
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeResponseData(data: any): any {
    if (!data) return null;
    
    // Limit response data size to avoid huge logs
    const jsonString = JSON.stringify(data);
    if (jsonString.length > 1000) {
      return { message: 'Response data too large for logging', size: jsonString.length };
    }
    
    return data;
  }

  private async logAudit(auditData: any) {
    try {
      await this.auditLogService.log(auditData);
    } catch (error) {
      console.error('Failed to log audit:', error);
      // Don't throw error to avoid breaking the main request
    }
  }
}
