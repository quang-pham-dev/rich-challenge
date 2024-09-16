import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from '@/modules/auth/auth.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';

import { GRAPHQL_INTROSPECTION, GRAPHQL_PLAYGROUND } from '@/constants/index';

// Exceptions
import { graphQLExceptionFormat } from '@/exceptions/index';

@Module({
  imports: [
    //#Configuration
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      useFactory: (configService: ConfigService) => {
        const playground = configService.get(GRAPHQL_PLAYGROUND);
        const introspection = configService.get(GRAPHQL_INTROSPECTION);
        return {
          autoSchemaFile: 'graphql/schema.graphql',
          sortSchema: true,
          playground,
          introspection: playground || introspection,
          formatError: graphQLExceptionFormat,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),

    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: 'localhost',
      port: 6379,
    }),

    PrometheusModule.register({
      path: '/metrics',
    }),

    // #Modules
    HealthModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
