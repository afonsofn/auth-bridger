import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

// constants
export const JWT_STRATEGY = 'jwt';
export const OAUTH_STRATEGY = 'google';

export const JWT_EXPIRE_TIME = '15m';

export const CREDENTIALS_INCORRECT = 'Credentials incorrect';
export const CREDENTIALS_TAKEN = 'Credential is already taken';
export const CREDENTIALS_FAILED = 'Credentials validation failed';
export const UNAUTHENTICATED = 'Unauthenticated';

export const JWT_SECRET = 'JWT_SECRET';
export const DATABASE_URL = 'DATABASE_URL';
export const GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
export const GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
export const GOOGLE_CALLBACK_URL = 'GOOGLE_CALLBACK_URL';

export const API_PORT = 3333;

// methods
export const handleExceptions = (error: any): void => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = error.meta?.target;

      if (field)
        throw new ForbiddenException(
          `The '${field}' credential is already taken`,
        );

      throw new ForbiddenException(CREDENTIALS_TAKEN);
    }

    throw new BadRequestException(CREDENTIALS_FAILED);
  }

  throw error;
};

export const cookieAccessToken = (token: string, res: Response) => {
  const maxAge = extractTimeValue(JWT_EXPIRE_TIME);

  res.cookie('access_token', token, {
    maxAge,
    sameSite: true,
    secure: false,
  });

  return res.status(HttpStatus.OK).json({ message: 'Login successful' });
};

const extractTimeValue = (str: string): number | null => {
  const timeUnits = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = str.match(/(\d+)([smhd])/);

  if (!match) return null;

  const [_, value, unit] = match;

  return timeUnits[unit] * parseInt(value);
};
