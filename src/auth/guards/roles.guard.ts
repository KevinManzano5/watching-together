import {
  Injectable,
  CanActivate,
  ExecutionContext,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient, Role } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard
  extends PrismaClient
  implements CanActivate, OnModuleInit
{
  constructor(private reflector: Reflector) {
    super();
  }

  async onModuleInit() {
    await this.$connect;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    let { user } = context.switchToHttp().getRequest();

    user = await this.user.findUnique({ where: { id: user.sub } });

    return requiredRoles.some((role) => user.role.includes(role));
  }
}
