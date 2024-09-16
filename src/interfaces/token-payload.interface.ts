export interface TokenPayload {
  id: string;
  email: string;
}

export interface JwtPayload extends TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

export enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  // Other...
}
