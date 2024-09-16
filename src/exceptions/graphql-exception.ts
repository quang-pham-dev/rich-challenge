import { HttpException } from '@nestjs/common';
import { GraphQLFormattedError } from 'graphql';

import { logger } from '@/utils/logger';

export function graphQLExceptionFormat(error: GraphQLFormattedError) {
  logger.log('graphQLExceptionFormat', error);
  const originalError = error.extensions?.originalError as HttpException & {
    statusCode?: string;
  };

  if (!originalError) {
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: error.path,
    };
  }

  return {
    message: originalError.message || error.message,
    code: originalError.statusCode || error.extensions?.code,
    timestamp: new Date().toISOString(),
    path: error.path,
  };
}
