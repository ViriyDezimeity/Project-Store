import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  ButtonGroup, 
  Container, 
  createStyles, 
  makeStyles, 
  Paper, 
  Tab as MuiTab, 
  Table, 
  TableBody, 
  TableCell as MuiTableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Tabs, 
  Theme, 
  Typography, 
  withStyles 
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { observer } from 'mobx-react-lite'
import { ProjectContext } from '../../../stores/Project';
import { useStore } from '../../../helpers/useStore';
import { UserAttributes, VacancyDTO } from 'diploma';
import { AuthenticationContext } from '../../../stores/Authentication';
import AddVacancy from './AddVacancy';
import { useSnackbar } from 'notistack';
import { Redirect } from 'react-router';
import Popup from '../../molecules/Popup';
import AddProject from '../Projects/AddProject';

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    paddingBottom: theme.spacing(4),
  },
  paragraph: {
    paddingBottom: theme.spacing(2),
    fontSize: '1.4rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  tabs: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: '#8c3e3e'
  },
  table: {
    minWidth: 650,
    borderSpacing: '0 20px !important',
    borderCollapse: 'separate',
  },
  tableRow: {
    textDecoration: 'none',
  }
}));

const Tab = withStyles((theme: Theme) => createStyles({
  root: {
    color: '#000',
    '&:hover': {
      color: '#000',
      opacity: 1,
    },
    '&$selected': {
      color: '#000',
    },
    '&:focus': {
      color: '#000',
    },
  },
  selected: {},
}))(MuiTab)

const TableCell = withStyles((theme: Theme) => 
  createStyles({
    head: {
      border: 'none',
    },
    body: {
      border: 'solid 1px #e0e0e0',
      padding: `${theme.spacing(3)}px 0`,
    }
  }),
)(MuiTableCell);

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  const classes = useStyles();
  
  return (
    <Paper 
      className={classes.paper}
      role='tabpanel'
      hidden={value !== index}
      id={`tab-panel-${index}`}
      {...other}
    >
      <Typography className={classes.paragraph}>
        {children}
      </Typography>
    </Paper>
  )
}

const Project = observer(() => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const { 
    project, 
    projectVacancies, 
    addUserToProjectVacancy, 
    getErrorMessage,
    updateProject,
    deleteProject,
    createVacancy,
  } = useStore(ProjectContext);
  const { isUserAuthorized, userData } = useStore(AuthenticationContext);

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleClickUpdateOpen = () => {
    setUpdateOpen(true);
  }

  const handleClickUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClickClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleDelete = async (): Promise<void> => {
    const deleteResult: boolean = await deleteProject();

    setIsDeleted(deleteResult);
  }

  const errorMessage: string | null = getErrorMessage();
  if (errorMessage) {
    enqueueSnackbar(`Ошибка: ${errorMessage}`, { variant: 'error' });
  }

  if (isDeleted) {
    return (
      <Redirect to='/' />
    )
  }
  
  if (project === null) {
    return (
      <div>
        Проект не найден
      </div>
    )
  }


  return (
    <Container>
      <Typography className={classes.header} align='center' variant='h4'>
        {project.title}
      </Typography>
      <Paper className={classes.paper}>
        <Typography className={`${classes.paragraph} ${classes.buttons}`}>
          Заказчик: {project.customer}
          {project.managerId === userData?.id &&
            <ButtonGroup disableElevation >
              <Button
                onClick={handleClickUpdateOpen}
              >
                <EditIcon color="primary"/>
              </Button>
              <Popup
                title='Добавить вакансию'
                open={updateOpen}
                handlePopupClose={handleClickUpdateClose}
                >
                  <AddProject 
                    onSubmit={updateProject}
                    getErrorMessage={getErrorMessage}
                    project={project}
                    handlePopupClose={handleClickUpdateClose}
                  />
                </Popup>
              <Button onClick={() => handleDelete()}>
                <DeleteIcon color="secondary" />
              </Button>
            </ButtonGroup>
          }
        </Typography>
        <Typography className={classes.paragraph}>
          Руководитель: {project.manager.firstName} {project.manager.lastName}
        </Typography>
        <Typography className={classes.paragraph}>
          Команда:
          <ul>
            {project.team.map((user: UserAttributes) => {
              return (
                <li>{user.firstName} {user.lastName}</li>
              )
            })}
          </ul>
        </Typography>
      </Paper>
      <Box className={classes.tabs}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          classes={{
            indicator: classes.indicator
          }}
        >
          <Tab 
            value={0}
            label="Информация о проекте"
          />
          <Tab 
            value={1}
            label="Вакансии"
          />
          <Tab 
            value={2}
            label="Результат проекта"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          {project.description.split('\n').map((text: string) => (
            <Typography>
              {text}
              <br />
            </Typography>
          ))}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {project.managerId === userData?.id &&
            <div style={{float: 'right'}}>
              <Button
                variant="contained" 
                color="primary"
                type="submit"
                onClick={handleClickOpen}
              >
                <Typography>
                Добавить вакансию
                </Typography>
              </Button>
              <Popup
               title='Добавить вакансию'
               open={open}
               handlePopupClose={handleClickClose}
              >
                <AddVacancy 
                  onSubmit={createVacancy}
                  handlePopupClose={handleClickClose}
                />
              </Popup>
            </div>
          }
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Роль</TableCell>
                  <TableCell align="center">Кол-во</TableCell>
                  <TableCell align="center">Требования</TableCell>
                  {isUserAuthorized &&
                    <TableCell align="center"></TableCell>
                  }
                  </TableRow>
              </TableHead>
              <TableBody>
                {projectVacancies && projectVacancies.map((vacancy: VacancyDTO) => (
                  <TableRow key={vacancy.id} className={classes.tableRow}>
                    <TableCell align="center">{vacancy.role}</TableCell>
                    <TableCell align="center">{vacancy.currentNumber}/{vacancy.number}</TableCell>
                    <TableCell align="center">{vacancy.requirements}</TableCell>
                    {isUserAuthorized && vacancy.currentNumber !== vacancy.number &&
                      <TableCell align="center">
                        <Button
                          onClick={() => addUserToProjectVacancy(vacancy.id)}
                          variant="contained" 
                          color="primary"
                          type="submit"
                        >
                          Записаться
                        </Button>
                      </TableCell>
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {project.result.split('\n').map((text: string) => (
            <Typography>
              {text}
              <br />
            </Typography>
          ))}
        </TabPanel>
      </Box>

    </Container>
  )
})

export default Project;
