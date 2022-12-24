import type { NextFunction } from 'express';
import { CustomSocket } from '../../types';

export const usernameMiddleware = (
  socket: CustomSocket,
  next: NextFunction,
) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error('invalid username'));
  }

  socket.username = username;

  next();
};
