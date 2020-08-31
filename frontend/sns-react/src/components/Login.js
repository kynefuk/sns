import React, { useReducer } from 'react';
import { withCookies } from 'react-cookie';
import axios from 'axios';
import {
  Avatar,
  Button,
  TextField,
  Typography,
  makeStyles,
  Container,
  CircularProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  START_FETCH,
  FETCH_SUCCESS,
  ERROR_CATCHED,
  TOGGLE_MODE,
  INPUT_EDIT,
} from '../types/actionTypes';
import { loginReducer } from '../reducers/LoginReducer';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
  span: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'teal',
  },
  spanError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'fuchsia',
    marginTop: 10,
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const initialState = {
    isLoading: false,
    isLoginView: true,
    error: '',
    loginCredential: {
      username: '',
      password: '',
    },
    registerCredential: {
      email: '',
      password: '',
    },
  };
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const loginInputChanged = (event) => {
    const credential = state.loginCredential;
    credential[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: 'state.loginCredential',
      payload: credential,
    });
  };

  const registerInputChanged = (event) => {
    const credential = state.registerCredential;
    credential[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: 'state.registerCredential',
      payload: credential,
    });
  };

  const login = async (event) => {
    event.preventDefault();
    if (state.isLoginView) {
      try {
        dispatch({ type: START_FETCH });
        const res = await axios.post(
          'http://localhost:8000/auth/',
          state.loginCredential,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        props.cookies.set('current-token', res.data.token);

        res.data.token
          ? (window.location.href = '/profiles')
          : (window.location.href = '/');
      } catch (error) {
        dispatch({ type: ERROR_CATCHED });
      }
    } else {
      try {
        dispatch({ type: START_FETCH });
        axios.post(
          'http://localhost:8000/api/users/create/',
          state.registerCredential,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: TOGGLE_MODE });
      } catch (error) {
        dispatch({ type: ERROR_CATCHED });
      }
    }
  };

  const toggleView = () => {
    dispatch({ type: TOGGLE_MODE });
  };

  return (
    <Container maxWidth='xs'>
      <form onSubmit={login}>
        <div className={classes.paper}>
          {state.isLoading && <CircularProgress />}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant='h5'>
            {state.isLoginView ? 'Login' : 'Register'}
          </Typography>

          {state.isLoginView ? (
            <>
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                label='Email'
                name='username'
                value={state.loginCredential.username}
                onChange={loginInputChanged}
                autoFocus
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                label='Password'
                type='password'
                name='password'
                value={state.loginCredential.password}
                onChange={loginInputChanged}
                autoFocus
              />
            </>
          ) : (
            <>
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                label='Email'
                name='email'
                value={state.registerCredential.email}
                onChange={registerInputChanged}
                autoFocus
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                label='Password'
                type='password'
                name='password'
                value={state.registerCredential.password}
                onChange={registerInputChanged}
                autoFocus
              />
            </>
          )}

          <span className={classes.spanError}>{state.error}</span>

          {state.isLoginView ? (
            state.loginCredential.username && state.loginCredential.password ? (
              <Button
                className={classes.submit}
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
              >
                Login
              </Button>
            ) : (
              <Button
                className={classes.submit}
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                disabled
              >
                Login
              </Button>
            )
          ) : state.registerCredential.email &&
            state.registerCredential.password ? (
            <Button
              className={classes.submit}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              Register
            </Button>
          ) : (
            <Button
              className={classes.submit}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              disabled
            >
              Register
            </Button>
          )}

          <span onClick={toggleView} className={classes.span}>
            {state.isLoginView ? 'Create Account' : 'Back to login ?'}
          </span>
        </div>
      </form>
    </Container>
  );
};

export default withCookies(Login);
