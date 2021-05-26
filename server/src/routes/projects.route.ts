import {
  ProjectAttributes, ProjectCreationAttributes, UserAttributes, VacancyAttributes, VacancyCreationAttributes, VacancyUserAttributes,
} from 'diploma';
import express, { Router } from 'express';
import {
  check,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';
import ProjectController from '../controllers/project.controller';
import UserController from '../controllers/user.controller';
import VacancyController from '../controllers/vacancy.controller.';
import VacancyUserController from '../controllers/vacancyuser.controller';
import { ProjectResponse } from '../dto/ProjectDto';
import authMiddleware from '../middlewares/auth.middleware';

const projectsRouter = Router();

projectsRouter.get(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const projects: ProjectAttributes[] = await ProjectController.GetAll();

      const resultProjects: (ProjectResponse | null)[] = await Promise.all(
        projects.map(async (project: ProjectAttributes): Promise<ProjectResponse> => {
          
          const manager: UserAttributes | null = await UserController.GetOneByCondition({
            where: {
              id: project.manager,
            },
          });
          const team: UserAttributes[] = await UserController.GetTeamByProjectId(project.id);
          
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            customer: project.customer,
            dateBegin: project.dateBegin,
            dateEnd: project.dateEnd,
            controlPoints: project.controlPoints,
            result: project.result,
            manager,
            team,
          }
        }),
      );

      return res.json(resultProjects);
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

      const project: ProjectAttributes | null = await ProjectController.GetOneByCondition({
        where: {
          id,
        },
      });

      console.log(project);

      if (project === null) {
        return res.json({
          message: `Project with id ${id} not found`,
        });
      }

      const manager: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          id: project.manager,
        },
      });
      const team: UserAttributes[] = await UserController.GetTeamByProjectId(project.id);

      res.json({
        id: project.id,
        title: project.title,
        description: project.description,
        customer: project.customer,
        dateBegin: project.dateBegin,
        dateEnd: project.dateEnd,
        controlPoints: project.controlPoints,
        result: project.result,
        manager,
        team,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.get(
  '/:id/team',
  async (
    req: express.Request<{ id: string }>,
    res: express.Response,
  ) => {
    try {
      const { id } = req.params;

      const team: UserAttributes[] = await UserController.GetTeamByProjectId(id);

      res.json(team);
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
      const { id } = req.params;

      const vacancies: VacancyAttributes[] = await VacancyController.GetAllByCondition({
        where: {
          projectId: id
        }
      })

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
    check('manager', 'Manager Id must be UUID').isUUID(),
    check('customer', 'Customer must be longer than 1 character').isLength({ min: 1 }),
    check('title', 'Title must be longer than 1 character').isLength({ min: 1 }),
    check('controlPoints', 'Control Points must be longer than 1 character').isLength({ min: 1 }),
    check('description', 'Description must be longer than 1 character').isLength({
      min: 1,
    }),
    check('dateBegin', 'Date begin must be date').isDate(),
    check('dateEnd', 'Date end must be date').isDate(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect request', ...errors });
      }

      const data: ProjectCreationAttributes = req.body;

      const project: ProjectAttributes = await ProjectController.Create(data);

      const manager: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          id: project.manager,
        },
      });
      const team: UserAttributes[] = await UserController.GetTeamByProjectId(project.id);
      
      const result: ProjectResponse | null = {
        id: project.id,
        title: project.title,
        description: project.description,
        customer: project.customer,
        dateBegin: project.dateBegin,
        dateEnd: project.dateEnd,
        controlPoints: project.controlPoints,
        result: project.result,
        manager,
        team,
      }

      res.json({
        message: 'Project was created',
        project: result,
      });
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
    check('number', 'Number must be longer than 1 character').isNumeric(),
  ],
  async (
    req: express.Request<{ id: string }>, 
    res: express.Response
  ) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect request', ...errors });
      }

      const data: VacancyCreationAttributes = req.body;

      data.projectId = req.params.id;
      
      const result = await VacancyController.Create(data);

      res.json({
        message: 'Project was created',
        project: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

projectsRouter.post(
  '/:projectId/vacancies/:vacancyId',
  [
    authMiddleware,
  ],
  async (
    req: express.Request<{ 
      projectId: string,
      vacancyId: string,
    }>, 
    res: express.Response
  ) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect request', ...errors });
      }

      const user: UserAttributes | null = await UserController.GetOneByCondition({
        where: {
          id: req.body.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { vacancyId } = req.params;

      const vacancy: VacancyAttributes | null = await VacancyController.GetOneByCondition({
        where: {
          id: vacancyId,
        },
      });

      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found' });
      }

      const vacancyUser: VacancyUserAttributes[] = await VacancyUserController.GetAllByCondition({
        where: {
          userId: user.id,
          vacancyId: vacancyId,
        }
      })
      
      if (vacancyUser.length > 0) {
        return res.status(400).json({ message: 'The user has already been added to this position' });
      }

      VacancyUserController.Create({
        userId: user.id,
        vacancyId: vacancyId,
      })

      res.json(user);
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
    check('manager', 'Manager Id must be UUID').isUUID(),
    check('customer', 'Customer must be longer than 1 character').isLength({ min: 1 }),
    check('title', 'Title must be longer than 1 character').isLength({ min: 1 }),
    check('controlPoints', 'Control Points must be longer than 1 character').isLength({ min: 1 }),
    check('description', 'Description must be longer than 1 character').isLength({
      min: 1,
    }),
    check('dateBegin', 'Date begin must be date').isDate(),
    check('dateEnd', 'Date end must be date').isDate(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect request', ...errors });
      }

      const data: ProjectCreationAttributes = req.body;

      const project: ProjectAttributes | null = await ProjectController.Update(data);

      if (project === null) {
        res.json({
          message: 'Something went wrong',
        });
      }

      res.json({
        message: 'Project was updated',
        project,
      });
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

      const result: boolean = await ProjectController.DeleteById(id);

      if (!result) {
        res.json({
          message: `Project with id ${id} not found`,
        });
      }

      res.json({
        message: 'Project was deleted',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default projectsRouter;
