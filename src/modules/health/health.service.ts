import { Injectable } from '@nestjs/common';

// Base
import { HealthServiceBase } from './base/health.service.base';

// Services
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
