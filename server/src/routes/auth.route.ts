import express, { Router } from 'express';
import {
  check,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authMiddleware from '../middlewares/auth.middleware';
import UserController from '../controllers/user.controller';
import { UserAttributes, UserCreationAttributes } from 'diploma';

const authRouter = Router();

authRouter.post(
  '/registration',
  [
    check('departmentId', 'Department Id must be UUID').isUUID(),
    check('firstName', 'First Name must be longer than 1 character').isLength({ min: 1 }),
    check('lastName', 'Last Name must be longer than 1 character').isLength({
      min: 1,
    }),
    check('login', 'Login must be longer than 1 character').isLength({ min: 1 }),
    check('mail', 'Enter a valid email').isEmail(),
    check(
      'password',
      'Password must be longer than 3 and shorter than 12 characters',
    ).isLength({ min: 3, max: 12 }),
    check('phoneNumber', 'Phone Number must be longer than 1 character').isLength({ min: 1 }),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect request', ...errors });
      }

      const user: UserCreationAttributes = req.body;

      const candidate: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          mail: user.mail,
        },
      });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${user.mail} already exist` });
      }

      const hashPassword: string = await bcrypt.hash(user.password, 15);

      const result: UserAttributes | null = await UserController.Create({
        ...user,
        password: hashPassword,
      });

      if (result === null) {
        throw new Error();
      }

      const token: string = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY || 'SECRET_KEY',
        { expiresIn: '1h' },
      );

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.mail,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

authRouter.post(
  '/login',
  async (req: express.Request, res: express.Response) => {
    try {
      const { mail, password } = req.body;
      const user: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          mail,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPassValid: boolean = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token: string = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY || 'SECRET_KEY',
        { expiresIn: '1h' },
      );

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.mail,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

authRouter.get(
  '/auth',
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const user: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          id: req.body.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token: string = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY || 'SECRET_KEY',
        { expiresIn: '1h' },
      );
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.mail,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default authRouter;
