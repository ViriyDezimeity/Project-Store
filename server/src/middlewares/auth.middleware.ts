import express from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token: string | undefined | null = req
      .header('Authorization')
      ?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Auth Error' });
    }

    const decoded: string | object = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'SECRET_KEY',
    );

    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth Error' });
  }
};
