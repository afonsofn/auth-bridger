import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

// constants
export const JWT_STRATEGY = 'jwt';
export const GOOGLE_STRATEGY = 'google';
export const FACEBOOK_STRATEGY = 'facebook';

export const JWT_EXPIRE_TIME = '15m';

export const CREDENTIALS_INCORRECT = 'Credentials incorrect';
export const CREDENTIALS_TAKEN = 'Credential is already taken';
export const CREDENTIALS_FAILED = 'Credentials validation failed';
export const CREDENTIALS_FAILED_EMAIL = 'E-mail already registered';
export const CREDENTIALS_FAILED_PASSWORD =
  'Password does not meet security criteria';
export const CREDENTIALS_TAKEN_BY_JWT =
  'Email already registered. Please use email login';
export const CREDENTIALS_TAKEN_BY_PROVIDER =
  'Email already linked to a social login';
export const CREDENTIALS_TAKEN_PROVIDER_CONFLICT =
  'Email linked to another social login. Use the correct provider';
export const UNAUTHENTICATED = 'Unauthenticated';

export const JWT_SECRET = 'JWT_SECRET';
export const DATABASE_URL = 'DATABASE_URL';
export const GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
export const GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
export const GOOGLE_CALLBACK_URL = 'GOOGLE_CALLBACK_URL';

export const FACEBOOK_CLIENT_ID = 'FACEBOOK_CLIENT_ID';
export const FACEBOOK_CLIENT_SECRET = 'FACEBOOK_CLIENT_SECRET';
export const FACEBOOK_CALLBACK_URL = 'FACEBOOK_CALLBACK_URL';

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

export const validatePassword = (password: string): boolean => {
  /**
   * At least 8 characters;
   * At least one uppercase and one lowercase letter;
   * At least one number;
   * At least one special character.
   */
  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return isPasswordValid.test(password);
};

export const validateEmail = (email: string): boolean => {
  /**
   * It must follow the standard email format;
   * It must allow letters, numbers, periods, hyphens and underscores;
   * The domain must contain at least one period and cannot begin or end with a period.
   */
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return isEmailValid.test(email);
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
