import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(private prisma: PrismaService) {}

  async generateTwoFactorAuthenticationSecret(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userId, 'YourAppName', secret);

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorAuthSecret: secret },
    });

    return {
      secret,
      otpauthUrl,
    };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async enableTwoFactorAuth(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorAuthSecret,
    });

    if (isValid) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorAuthEnabled: true },
      });
      return true;
    }
    return false;
  }

  async verifyTwoFactorAuth(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return authenticator.verify({
      token,
      secret: user.twoFactorAuthSecret,
    });
  }
}
