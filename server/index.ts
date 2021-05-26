import express from 'express';
import path from 'path';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

import SequelizeInstance from './src/config/SequelizeInstance';
import authRouter from './src/routes/auth.route';
import projectsRouter from './src/routes/projects.route';
import departmentsRouter from './src/routes/departments.route';


const PORT: string = process.env.APP_PORT || '5000';
const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use('/api', authRouter);
app.use('/api/projects', projectsRouter)
app.use('/api/departments', departmentsRouter)

app.options('*', cors);

const start = async () => {
  try {
    await SequelizeInstance.checkConnection();

    app.listen(PORT, () => {
      console.log('Server running on port %d', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
