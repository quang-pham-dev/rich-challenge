import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { rateLimit } from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';

// Utils
import { logger } from '@/utils/logger';

// Config
import { graphqlHelmetConfig } from '@/config/index';

// Constants
import { ERRORS_MESSAGE } from '@/constants/errors-message.constant';

// Modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 8080;

  // #CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
    preflightContinue: true,
    credentials: true,
  });
  app.use(requestIp.mw());

  // Gzip
  app.use(compression());

  // BodyParser
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

  // Security
  app.use(helmet(graphqlHelmetConfig));

  // RateLimiter
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: ERRORS_MESSAGE.TOO_MANY_REQUESTS,
    keyGenerator: (req) => requestIp.getClientIp(req),
  });
  app.use('/auth/register', registerLimiter);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  await app.listen(PORT, () => {
    logger.info(`🚀Application is running on PORT: ${PORT}`);
  });
}

bootstrap();
