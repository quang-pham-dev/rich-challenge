import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { JWT_ACCESS_SECRET } from '@/constants/jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Flatten roles and permissions for easier access
    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set([
        ...user.permissions.map((up) => up.permission.name),
        ...user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.name),
        ),
      ]),
    ];

    return { ...user, roles, permissions };
  }
}
