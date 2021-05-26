import React from 'react'
import { Box, Button, Container, createStyles, makeStyles, Paper, Tab as MuiTab, Table, TableBody, TableCell as MuiTableCell, TableContainer, TableHead, TableRow, Tabs, Theme, Typography, withStyles } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { ProjectContext } from '../../../stores/Project';
import { useStore } from '../../../helpers/useStore';
import { UserAttributes, VacancyAttributes } from 'diploma';
import { AuthenticationContext } from '../../../stores/Authentication';

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    paddingBottom: theme.spacing(4),
  },
  paragraph: {
    paddingBottom: theme.spacing(2),
    fontSize: '1.4rem',
  },
  paper: {
    padding: theme.spacing(4)
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
  const { project, projectVacancies, addUserToProjectVacancy } = useStore(ProjectContext);
  const { isUserAuthorized, userData } = useStore(AuthenticationContext);
  const [value, setValue] = React.useState(0);

  const classes = useStyles();

  if (project === null) {
    return (
      <div>
        Проект не найден
      </div>
    )
  }
  const handleClick = async (vacancyId: string) => {
    addUserToProjectVacancy(vacancyId);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Typography className={classes.header} align='center' variant='h4'>
        {project.title}
      </Typography>
      <Typography className={classes.paragraph}>
        Заказчик: {project.customer}
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
          {project.description}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Роль</TableCell>
                  <TableCell align="center">Кол-во</TableCell>
                  <TableCell align="center">Требования</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectVacancies && projectVacancies.map((vacancy: VacancyAttributes) => (
                  <TableRow key={vacancy.id} className={classes.tableRow}>
                    <TableCell align="center">{vacancy.role}</TableCell>
                    <TableCell align="center">{vacancy.number}</TableCell>
                    <TableCell align="center">{vacancy.requirements}</TableCell>
                    <TableCell align="center">
                    {isUserAuthorized && project.team.filter(tm => tm.id === userData?.id).length === 0 &&
                      <Button
                        onClick={() => addUserToProjectVacancy(vacancy.id)}
                        variant="contained" 
                        color="primary"
                        type="submit"
                      >
                        Записаться
                      </Button>
                    }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {project.result}
        </TabPanel>
      </Box>

    </Container>
  )
})

export default Project;
