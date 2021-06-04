import {
  ProjectCreationAttributes,
  ProjectDTO,
  UserDTO,
  VacancyCreationAttributes,
  VacancyDTO,
  VacancyUserDTO,
} from 'diploma';
import express, { Router } from 'express';
import {
  check,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';
import ProjectController from '../controllers/project.controller';
import VacancyController from '../controllers/vacancy.controller.';
import vacancyuserController from '../controllers/vacancyuser.controller';
import authMiddleware from '../middlewares/auth.middleware';

const projectsRouter = Router();

projectsRouter.get(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const projects: ProjectDTO[] = await ProjectController.GetAll();

      return res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.get(
  '/:id',
  async (
    req: express.Request<{ id: string }>,
    res: express.Response,
  ) => {
    try {
      const { id } = req.params;

      const project: ProjectDTO | null = await ProjectController.GetOneByCondition({
        where: {
          id,
        },
      });

      if (project === null) {
        return res.status(404).json({
          message: `Проект с id ${id} не найден`,
        });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.get(
  '/:id/vacancies',
  async (
    req: express.Request<{ id: string }>,
    res: express.Response,
  ) => {
    try {
      const vacancies: VacancyDTO[] = await VacancyController.GetAllByCondition({
        where: {
          projectId: req.params.id,
        },
      });

      res.json(vacancies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.post(
  '/',
  [
    authMiddleware,
    check('customer', 'Customer must be longer than 1 character').isLength({ min: 1 }),
    check('title', 'Title must be longer than 1 character').isLength({ min: 1 }),
    check('controlPoints', 'Control Points must be longer than 1 character').isLength({ min: 1 }),
    check('description', 'Description must be longer than 1 character').isLength({
      min: 1,
    }),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Неверный запрос', ...errors });
      }

      const data: ProjectCreationAttributes = req.body;

      data.id = undefined;
      data.managerId = req.body.user.id;

      const project: ProjectDTO | null = await ProjectController.Create(data);

      if (!project) {
        res.status(400).json({
          message: 'Неверный запрос',
        });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.post(
  '/:id/vacancies',
  [
    authMiddleware,
    check('role', 'Role must be longer than 1 character').isLength({ min: 1 }),
  ],
  async (
    req: express.Request<{ id: string }>,
    res: express.Response,
  ) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Неверный запрос', ...errors });
      }

      const project: ProjectDTO | null = await ProjectController.GetOneByCondition({
        where: {
          id: req.params.id,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ message: `Проект с id ${req.params.id} не найден` });
      }

      if (project.managerId !== req.body.user.id) {
        return res
          .status(400)
          .json({ message: 'Добавить вакансию может только руководитель проекта' });
      }

      const data: VacancyCreationAttributes = req.body;

      data.projectId = req.params.id;

      if (!data.number || data.number === '') {
        data.number = '1';
      }

      const vacancy: VacancyDTO = await VacancyController.Create(data);

      res.json(vacancy);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.post(
  '/:projectId/vacancies/:vacancyId/addUser',
  [
    authMiddleware,
  ],
  async (
    req: express.Request<{
      projectId: string;
      vacancyId: string;
    }>,
    res: express.Response,
  ) => {
    try {
      const project: ProjectDTO | null = await ProjectController.GetOneByCondition({
        where: {
          id: req.params.projectId,
        },
      });

      if (project?.team.filter((user: UserDTO) => user.id === req.body.user.id).length) {
        return res
          .status(403)
          .json({ message: 'Пользователь уже находится в проекте на другой вакансии' });
      }

      const vacancyUser: VacancyUserDTO | null = await vacancyuserController.Create({
        userId: req.body.user.id,
        vacancyId: req.params.vacancyId,
      });

      if (!vacancyUser) {
        return res.status(404).json({
          message: 'The user has not been added to the vacancy',
        });
      }

      res.json(vacancyUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.put(
  '/',
  [
    authMiddleware,
    check('id', 'Id must be UUID').isUUID(),
    check('managerId', 'Manager Id must be UUID').isUUID(),
    check('customer', 'Customer must be longer than 1 character').isLength({ min: 1 }),
    check('title', 'Title must be longer than 1 character').isLength({ min: 1 }),
    check('controlPoints', 'Control Points must be longer than 1 character').isLength({ min: 1 }),
    check('description', 'Description must be longer than 1 character').isLength({
      min: 1,
    }),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Неверный запрос', ...errors });
      }

      const data: ProjectCreationAttributes = req.body;

      if (data.managerId !== req.body.user.id) {
        return res
          .status(400)
          .json({ message: 'Изменить проект может только руководитель проекта' });
      }

      const project: ProjectDTO | null = await ProjectController.Update(data);

      if (!project) {
        return res
          .status(404)
          .json({ message: `Проект с id ${data.id} не найден` });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.delete(
  '/:id',
  authMiddleware,
  async (
    req: express.Request<{ id: string }>,
    res: express.Response,
  ) => {
    try {
      const { id } = req.params;

      const project: ProjectDTO | null = await ProjectController.GetOneByCondition({
        where: {
          id: req.params.id,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ message: `Проект с id ${id} не найден` });
      }

      if (project.managerId !== req.body.user.id) {
        return res
          .status(400)
          .json({ message: 'Удалить проект может только руководитель проекта' });
      }

      await ProjectController.DeleteById(id);

      res.json({});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default projectsRouter;
