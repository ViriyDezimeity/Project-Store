import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
      margin: theme.spacing(1),
    },
  },
}));

interface FromProps {
  children: React.ReactElement;
  onSubmit: (event: React.SyntheticEvent) => void;
}

export default function Form({ children, onSubmit }: FromProps): JSX.Element {
  const classes = useStyles();
  return (
    <form className={classes.root} onSubmit={onSubmit} autoComplete="off">
      {children}
    </form>
  );
}