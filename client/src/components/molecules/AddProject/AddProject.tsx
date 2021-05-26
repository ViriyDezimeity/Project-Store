import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { useStore } from '../../../helpers/useStore';
import { Box, Grid } from '@material-ui/core';
import { useForm } from '../../../helpers/useForm';
import { ProjectCreationAttributes } from 'diploma';
import Form from '../Form';
import { ProjectsContext } from '../../../stores/Projects';
import { AuthenticationContext } from '../../../stores/Authentication';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    float: 'right'
  },
}));

const AddProject = observer(
  (): JSX.Element => {
    const { isUserAuthorized, userData } = useStore(AuthenticationContext);

    const initialFormValues: ProjectCreationAttributes = {
      title: '',
      description: '',
      customer: '',
      dateBegin: new Date(),
      dateEnd: new Date(),
      controlPoints: '',
      result: '',
      manager: userData ? userData.id : '',
    };

    const { createProject } = useStore(ProjectsContext);

    const classes = useStyles();

    const [isAdded, setAddedStatus] = useState(false);

    const validate = (fieldValues = values) => {
      const temp = { ...errors };
      if ('header' in fieldValues)
        temp.header = fieldValues.header ? '' : 'Это поле необходимо заполнить.';
      setErrors({
        ...temp,
      });
      if (fieldValues === values)
        return Object.values(temp).every((x) => x === '');
    };
  
    const {
      values,
      errors,
      setErrors,
      handleInputChange,
      resetForm,
    } = useForm(initialFormValues, true, validate);
  
    const handleSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (validate()) {
        await createProject(values);
        setAddedStatus(true);
        resetForm();
      }
    };

    if (isAdded || !isUserAuthorized) {
      return <Redirect to='/' />;
    }

    return (
      <Box display="flex" flexGrow="1" alignItems="center">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AccountTreeIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Добавление проекта
            </Typography>
            <Form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12}>
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Название проекта"
                    name="title"
                    autoComplete="title"
                    value={values.title}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Описание"
                    name="description"
                    autoComplete="description"
                    value={values.description}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="customer"
                    label="Заказчик"
                    name="customer"
                    autoComplete="customer"
                    value={values.customer}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="dateBegin"
                    label="День начала"
                    type="date"
                    value={values.dateBegin}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                    error={errors.dateBegin}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="dateEnd"
                    label="День окончания"
                    type="date"
                    value={values.dateEnd}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                    error={errors.dateEnd}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="controlPoints"
                    label="Контрольные точки"
                    name="controlPoints"
                    autoComplete="controlPoints"
                    value={values.controlPoints}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="result"
                    label="Результаты"
                    name="result"
                    autoComplete="result"
                    value={values.result}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <div className={classes.submit}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                      style={{marginRight: '16px'}}
                    >
                      Submit
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Form>
          </div>
        </Container>
      </Box>
    );
  }
);

export default AddProject;
