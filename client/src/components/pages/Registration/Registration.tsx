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
import { useSnackbar } from 'notistack';
import { DatePicker } from '@material-ui/pickers';

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

interface IUserCreationErrors {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  mail: string;
  login: string;
  password: string;
  departmentId: string;
}

const initialFormValues: UserCreationAttributes = {
  firstName: '',
  lastName: '',
  patronymic: undefined,
  dateBirth: undefined,
  placeWork: undefined,
  phoneNumber: '',
  mail: '',
  login: '',
  password: '',
  aboutMe: undefined,
  departmentId: ''
};

const initialErrorValues: IUserCreationErrors = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  mail: '',
  login: '',
  password: '',
  departmentId: ''
};

const Registration = observer(
  (): JSX.Element => {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const { register, isUserAuthorized, getErrorMessage } = useStore(AuthenticationContext);
    
    const { departments } = useStore(DepartmentsContext);

    const [isLoading, setLoadingStatus] = useState(false);

    const validate = (): boolean => {
      const fieldValues: UserCreationAttributes = values;
      
      const temp = { ...errors };

      temp.firstName = fieldValues.firstName ? '' : 'Это поле обязательно к заполнению';
      temp.lastName = fieldValues.lastName ? '' : 'Это поле обязательно к заполнению';
      temp.phoneNumber = fieldValues.phoneNumber ? '' : 'Это поле обязательно к заполнению';
      temp.mail = fieldValues.mail ? '' : 'Это поле обязательно к заполнению';
      temp.login = fieldValues.login ? '' : 'Это поле обязательно к заполнению';
      temp.password = fieldValues.password ? '' : 'Это поле обязательно к заполнению';
      temp.departmentId = fieldValues.departmentId ? '' : 'Это поле обязательно к заполнению';

      setErrors({
        ...temp,
      });

      if (fieldValues === values) {
        return Object.values(temp).every((x) => x === '');
      }

      return false;
    };
  
    const {
      values,
      setValues,
      errors,
      setErrors,
      handleInputChange,
      resetForm,
    } = useForm({
      initialFormValues,
      initialErrorValues,
      validate
    });
  
    const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
      event.preventDefault();
      if (validate()) {
        setLoadingStatus(true);
        await register(values);
        const errorMessage: string | null = getErrorMessage();
        if (errorMessage) {
          setLoadingStatus(false);
          enqueueSnackbar(`Ошибка: ${errorMessage}`, { variant: 'error' });
        }
      }
    };

    const handleDateBirthChange = (date: Date | null): void => {
      if (date) {
        setValues({
          ...values,
          dateBirth: date
        })
      }
    }

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
                    variant='outlined'
                    name='firstName'
                    label='Имя *'
                    value={values.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                  <TextField 
                    variant='outlined'
                    name='lastName'
                    label='Фамилия *'
                    value={values.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                  <TextField 
                    variant='outlined'
                    name='patronymic'
                    label='Отчество'
                    value={values.patronymic}
                    onChange={handleInputChange}
                  />
                  <DatePicker
                    name='dateBegin'
                    animateYearScrolling
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="День рождения"
                    value={values.dateBirth}
                    onChange={handleDateBirthChange}
                  />
                  <TextField 
                    variant='outlined'
                    name='placeWork'
                    label='Место работы'
                    value={values.placeWork}
                    onChange={handleInputChange}
                  />
                  <TextField 
                    variant='outlined'
                    name='phoneNumber'
                    label='Телефон *'
                    value={values.phoneNumber}
                    onChange={handleInputChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                  <TextField 
                    variant='outlined'
                    name='mail'
                    label='Электронная почта *'
                    type='email'
                    value={values.mail}
                    onChange={handleInputChange}
                    error={!!errors.mail}
                    helperText={errors.mail}
                  />
                  <TextField 
                    variant='outlined'
                    name='login'
                    label='Логин *'
                    value={values.login}
                    onChange={handleInputChange}
                    error={!!errors.login}
                    helperText={errors.login}
                  />
                  <TextField 
                    variant='outlined'
                    name='password'
                    label='Пароль *'
                    type='password'
                    value={values.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <TextField 
                    variant='outlined'
                    name='aboutMe'
                    label='О себе'
                    value={values.aboutMe}
                    onChange={handleInputChange}
                    multiline
                    rows={5}
                    rowsMax={10}
                  />
                  <Select
                    native
                    value={values.departmentId}
                    onChange={handleInputChange}
                    inputProps={{
                      name: 'departmentId',
                    }}
                    fullWidth
                    error={!!errors.departmentId}
                    variant="outlined"
                    style={{
                      "width": "100%",
                      "margin": "8px",
                    }}
                  >
                    <option aria-label="None" value="" >Выберите факультет</option>
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
