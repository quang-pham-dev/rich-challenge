import { Controller } from '@nestjs/common';

// Services
import { HealthService } from './health.service';

// Base
import { HealthControllerBase } from './base/health.controller.base';

@Controller('_health')
export class HealthController extends HealthControllerBase {
  constructor(protected readonly healthService: HealthService) {
    super(healthService);
  }
}
