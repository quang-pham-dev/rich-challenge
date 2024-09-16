export const BASE_ERRORS_MESSAGE = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  NOT_ACCEPTABLE: 'Not Acceptable',
  CONFLICT: 'Conflict',
  GONE: 'Gone',
  LENGTH_REQUIRED: 'Length Required',
  REQUEST_ENTITY_TOO_LARGE: 'Payload Too Large',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  UPGRADE_REQUIRED: 'Upgrade Required',
  PRECONDITION_REQUIRED: 'Precondition Required',
  TOO_MANY_REQUESTS: 'Too Many Requests',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  EXTERNAL_SERVER_ERROR: 'External Server Error',
  NOT_IMPLEMENTED: 'Not Implemented',
  BAD_GATEWAY: 'Bad Gateway',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  GATEWAY_TIMEOUT: 'Gateway Timeout',
};

export const ERRORS_MESSAGE = {
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SOME_THING_WENT_WRONG: 'Something went wrong',
  CURRENT_PAGE_HAS_TO_GREATER_THAN_O: 'Current page has to greater than 0',
  PAGE_SIZE_HAS_TO_GREATER_THAN_O: 'Page size has to greater than 0',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  ALREADY_EXISTS: 'already exists',
  INVALID: 'Invalid',
  CANNOT_BE_EMPTY: 'cannot be empty',
  NOT_FOUND: 'Not Found',
  TOO_MANY_REQUESTS:
    'Too many accounts created from this IP, please try again after an hour',

  // Base
  ...BASE_ERRORS_MESSAGE,
};
