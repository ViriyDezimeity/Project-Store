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
import { Box, Grid, Link as MuiLink } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = observer(
  (): JSX.Element => {
    const { login, isUserAuthorized } = useStore(AuthenticationContext);
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoadingStatus] = useState(false);

    const formSubmit = (event: React.SyntheticEvent) => {
      setLoadingStatus(true);
      event.preventDefault();
      login(email, password);
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
            <form className={classes.form} noValidate onSubmit={formSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Электронная почта"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
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
            </form>
          </div>
        </Container>
      </Box>
    );
  }
);

export default Login;
