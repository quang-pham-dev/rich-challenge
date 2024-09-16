import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async createPermission(name: string, description?: string) {
    return this.prisma.permission.create({
      data: { name, description },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany();
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({
      data: { roleId, permissionId },
    });
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
    });
  }

  async assignPermissionToUser(userId: string, permissionId: string) {
    return this.prisma.userPermission.create({
      data: { userId, permissionId },
    });
  }

  async removePermissionFromUser(userId: string, permissionId: string) {
    return this.prisma.userPermission.delete({
      where: {
        userId_permissionId: { userId, permissionId },
      },
    });
  }
}
