import { DepartmentAttributes } from 'diploma';
import express, { Router } from 'express';
import DepartmentController from '../controllers/department.controller';

const departmentsRouter = Router();

departmentsRouter.get(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const departments: DepartmentAttributes[] | null = await DepartmentController.GetAll();

      return res.json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default departmentsRouter;
