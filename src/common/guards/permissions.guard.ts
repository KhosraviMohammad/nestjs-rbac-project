import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { MainDatabaseService } from '../../modules/database/database.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: MainDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      return false;
    }

    // Get all permissions for user's roles
    const userRoleIds = user.roles.map((role) => role.id);
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: {
          in: userRoleIds,
        },
      },
      include: {
        permission: true,
      },
    });

    const userPermissions = rolePermissions.map((rp) => rp.permission.name);
    
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }
}
