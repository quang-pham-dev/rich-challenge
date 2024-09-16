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
const ALREADY_EXISTS = 'already exists';
const INVALID = 'Invalid';
const CANNOT_BE_EMPTY = 'cannot be empty';
const CANNOT_BE_MORE_THAN_40_CHARACTERS = 'cannot be more than 40 characters';
const NOT_FOUND = 'Not Found';

export const ERRORS_MESSAGE = {
  CURRENT_PAGE_HAS_TO_GREATER_THAN_O: 'Current page has to greater than 0',
  PAGE_SIZE_HAS_TO_GREATER_THAN_O: 'Page size has to greater than 0',
  FIRST_NAME_CANNOT_BE_EMPTY: `First Name ${CANNOT_BE_EMPTY}`,
  LAST_NAME_CANNOT_BE_EMPTY: `Last Name ${CANNOT_BE_EMPTY}`,
  EMAIL_ALREADY_EXISTS: `Email ${ALREADY_EXISTS}`,
  PASSWORD_ALREADY_EXISTS: `Email ${ALREADY_EXISTS}`,
  PHONE_ALREADY_EXISTS: `Phone ${ALREADY_EXISTS}`,
  PASSWORD_CANNOT_BE_EMPTY: `Password ${CANNOT_BE_EMPTY}`,
  EMAIL_CANNOT_BE_EMPTY: `Email ${CANNOT_BE_EMPTY}`,
  PHONE_CANNOT_BE_EMPTY: `Phone ${CANNOT_BE_EMPTY}`,
  INVALID_PHONE: `${INVALID} Phone Number`,
  INVALID_PASSWORD: `${INVALID} Password`,
  PASSWORD_INCORRECT: 'Password incorrect',
  WRONG_PASSWORD: 'Wrong password. Please try again',
  USERNAME_OR_PASSWORD_INCORRECT: 'Username or password incorrect',
  INVALID_EMAIL: `${INVALID} Email`,
  PASSWORD_CANNOT_BE_LESS_THAN_8_CHARACTERS:
    'Password cannot be less than 8 characters',
  FIRST_NAME_CANNOT_BE_LESS_THAN_2_CHARACTERS:
    'First Name cannot be less than 2 characters',
  LAST_NAME_CANNOT_BE_LESS_THAN_2_CHARACTERS:
    'Last Name cannot be less than 2 characters',
  FIRST_NAME_CANNOT_BE_MORE_THAN_40_CHARACTERS: `First Name ${CANNOT_BE_MORE_THAN_40_CHARACTERS}`,
  LAST_NAME_CANNOT_BE_MORE_THAN_40_CHARACTERS: `Last Name ${CANNOT_BE_MORE_THAN_40_CHARACTERS}`,
  PASSWORD_CANNOT_BE_MORE_THAN_40_CHARACTERS: `Password ${CANNOT_BE_MORE_THAN_40_CHARACTERS}`,
  PLEASE_VERIFY_YOUR_EMAIL: 'Please verify your email',
  SOME_THING_WENT_WRONG: 'Some thing went wrong',
  USER_NOT_FOUND: `User ${NOT_FOUND}`,
  INVALID_CUSTOMER_ID: 'Invalid customer id',
  EMAIL_NOT_EXISTED: 'This email does not exist',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid Email or Password',
  YOUR_ACCOUNT_IS_DELETED:
    'Your account is deleted. Please create a new account.',
  ...BASE_ERRORS_MESSAGE,
};
