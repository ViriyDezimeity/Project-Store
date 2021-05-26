import React from 'react'
import { makeStyles, Table, TableBody, TableCell as MuiTableCell, TableContainer, TableHead, TableRow, withStyles, Theme, createStyles, Button } from '@material-ui/core'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../helpers/useStore';
import { ProjectsContext } from '../../../stores/Projects';
import { Link } from 'react-router-dom';
import { UserAttributes } from 'diploma';
import { AuthenticationContext } from '../../../stores/Authentication';

const TableCell = withStyles((theme: Theme) => 
  createStyles({
    head: {
      border: 'none',
    },
    body: {
      border: 'solid 1px #e0e0e0',
      padding: `${theme.spacing(6)}px 0`,
    }
  }),
)(MuiTableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    borderSpacing: '0 20px !important',
    borderCollapse: 'separate',
  },
  tableRow: {
    textDecoration: 'none',
  }
});

const Projects = observer(() => {
  const { projects } = useStore(ProjectsContext);
  const { isUserAuthorized } = useStore(AuthenticationContext);

  const classes = useStyles();

  if (projects === null) {
    return (
      <div>
        Еще не было создано ни одного проекта
      </div>
    )
  }

  return (
    <div>
      {isUserAuthorized &&
        <div style={{float: 'right'}}>
          <Button
            href='/project/add'
            variant="contained" 
            color="primary"
            type="submit"
          >
            Добавить проект
          </Button>
        </div>
      }
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">№</TableCell>
              <TableCell align="center">Название проекта</TableCell>
              <TableCell align="center">Заказчик</TableCell>
              <TableCell align="center">Руководитель</TableCell>
              <TableCell align="center">Команда проекта</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, idx) => (
              <TableRow component={Link} to={project.id} key={project.id} className={classes.tableRow}>
                <TableCell align="center">{idx}</TableCell>
                <TableCell align="center">{project.title}</TableCell>
                <TableCell align="center">{project.customer}</TableCell>
                <TableCell align="center">{project.manager.firstName} {project.manager.lastName}</TableCell>
                <TableCell align="center">
                  <ul>
                    {project.team.map((user: UserAttributes) => {
                      return (
                        <li>{user.firstName} {user.lastName}</li>
                      )
                    })}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
})

export default Projects;