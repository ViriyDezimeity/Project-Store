import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { useStore } from '../../../helpers/useStore';
import { AuthenticationContext } from '../../../stores/Authentication';
import Loading from '../../atoms/Loading';
import { Box, Grid, Select } from '@material-ui/core';
import { useForm } from '../../../helpers/useForm';
import { DepartmentAttributes, UserCreationAttributes } from 'diploma';
import Form from '../../molecules/Form';
import { DepartmentsContext } from '../../../stores/Departments';

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

const initialFormValues: UserCreationAttributes = {
  firstName: '',
  lastName: '',
  patronymic: '',
  dateBirth: new Date(),
  placeWork: '',
  phoneNumber: '',
  mail: '',
  login: '',
  password: '',
  aboutMe: '',
  departmentId: ''
};

const Registration = observer(
  (): JSX.Element => {
    const { register, isUserAuthorized } = useStore(AuthenticationContext);
    const classes = useStyles();

    const { departments } = useStore(DepartmentsContext);

    const [isLoading, setLoadingStatus] = useState(false);

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
  
    const handleSubmit = (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (validate()) {
        setLoadingStatus(true);
        register(values);
        resetForm();
      }
    };

    if (isUserAuthorized) {
      return <Redirect to="/" />;
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Box display="flex" flexGrow="1" alignItems="center">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Регистрация
            </Typography>
            <Form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12}>
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="Имя"
                    name="firstName"
                    autoComplete="firstName"
                    value={values.firstName}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Фамилия"
                    name="lastName"
                    autoComplete="lastName"
                    value={values.lastName}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="patronymic"
                    label="Отчество"
                    name="patronymic"
                    autoComplete="patronymic"
                    value={values.patronymic}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="dateBirth"
                    label="День рождения"
                    type="date"
                    value={values.dateBirth}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                    error={errors.dateBirth}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="placeWork"
                    label="Место работы"
                    name="placeWork"
                    autoComplete="placeWork"
                    value={values.placeWork}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Телефон"
                    name="phoneNumber"
                    autoComplete="phoneNumber"
                    value={values.phoneNumber}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="mail"
                    label="Электронная почта"
                    name="mail"
                    autoComplete="mail"
                    value={values.mail}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="login"
                    label="Никнейм"
                    name="login"
                    autoComplete="login"
                    value={values.login}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="aboutMe"
                    label="О себе"
                    name="aboutMe"
                    autoComplete="aboutMe"
                    value={values.aboutMe}
                    autoFocus
                    onChange={handleInputChange}
                  />
                  <Select
                    native
                    value={values.departmentId}
                    onChange={handleInputChange}
                    inputProps={{
                      name: 'departmentId',
                    }}
                    fullWidth
                    error={errors.departmentId}
                    variant="outlined"
                    style={{
                      "width": "100%",
                      "margin": "8px",
                    }}
                  >
                    <option aria-label="None" value="" />
                    {departments?.map((department: DepartmentAttributes) => {
                      return (
                        <option value={department.id}>{department.departmentName}</option>
                      )
                    })}
                  </Select>
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

export default Registration;
