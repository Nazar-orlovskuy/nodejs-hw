import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

const SALT_ROUNDS = 10;

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw createHttpError(400, 'Email in use');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ email, password: hashed });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies || {};

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.refreshTokenValidUntil.getTime() < Date.now()) {
      throw createHttpError(401, 'Session token expired');
    }

    await Session.findByIdAndDelete(session._id);

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies || {};

    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    const cookieOptions = { httpOnly: true, secure: true, sameSite: 'none' };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('sessionId', cookieOptions);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
