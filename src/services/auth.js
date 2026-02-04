import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(64).toString('hex');

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(now + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const commonOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...commonOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...commonOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...commonOptions,
    maxAge: ONE_DAY,
  });
};
