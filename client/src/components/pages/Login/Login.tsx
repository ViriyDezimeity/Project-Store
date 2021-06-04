import React, { useState } from 'react';
import { Avatar, Button, TextField as MuiTextField, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';

import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import { useStore } from '../../../helpers/useStore';
import { AuthenticationContext } from '../../../stores/Authentication';
import Loading from '../../atoms/Loading';
import { Box, Grid, Link as MuiLink } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Form from '../../molecules/Form';
import { useForm } from '../../../helpers/useForm';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const TextField = withStyles((theme: Theme) => createStyles({
  root: {
    margin: 0,
  },
}))(MuiTextField);

interface ILogin {
  email: string;
  password: string;
}

interface ILoginErrors {
  email: string;
  password: string;
}

const initialFormValues: ILogin = {
  email: '',
  password: '',
};

const initialErrorValues: ILoginErrors = {
  email: '',
  password: '',
};

const Login = observer(
  (): JSX.Element => {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const { login, isUserAuthorized, getErrorMessage } = useStore(AuthenticationContext);

    const [isLoading, setLoadingStatus] = useState(false);

    const validate = (): boolean => {
      const fieldValues: ILogin = values;

      let temp = { ...errors };

      temp.email = fieldValues.email ? '' : 'Введите email';
      temp.password = fieldValues.password ? '' : 'Введите пароль';

      setErrors({
        ...temp
      })

      if (fieldValues === values) {
        return Object.values(temp).every(x => x === '');
      }

      return false;
    }

    const { 
      values,
      errors,
      setErrors,
      handleInputChange,
    } = useForm({
      initialErrorValues,
      initialFormValues,
      validate,
    });

    const onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
      event.preventDefault();
      if (validate()) {
        setLoadingStatus(true);
        await login(values.email, values.password);
        const errorMessage: string | null = getErrorMessage();
        if (errorMessage) {
          setLoadingStatus(false);
          enqueueSnackbar(`Ошибка: ${errorMessage}`, { variant: 'error' });
        }
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
              Авторизация
            </Typography>
            <Form onSubmit={onSubmit}>
              <Grid>
                <TextField 
                  variant='outlined'
                  name='email'
                  label='Электронная почта *'
                  value={values.email}
                  type='email'
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField 
                  variant='outlined'
                  name='password'
                  label='Пароль *'
                  value={values.password}
                  type='password'
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Войти
                </Button>
                <Grid container>
                  <Grid item xs>
                    <MuiLink component={Link} to="#" variant="body2">
                    </MuiLink>
                  </Grid>
                  <Grid item>
                    <MuiLink component={Link} to="/auth/registration" variant="body2">
                      Регистрация
                    </MuiLink>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </div>
        </Container>
      </Box>
    );
  }
);

export default Login;
