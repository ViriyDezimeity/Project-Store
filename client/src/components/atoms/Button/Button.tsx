import React from 'react';
import { Button as MuiButton, makeStyles, PropTypes } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  label: {
    textTransform: 'none',
  },
}));

interface ButtonProps {
  type?: 'button' | 'reset' | 'submit';
  text: string;
  size?: 'small' | 'large' | 'medium';
  color?: PropTypes.Color;
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  type,
  text,
  size,
  color,
  variant,
  onClick,
}: ButtonProps): JSX.Element {
  const classes = useStyles();

  return (
    <MuiButton
      type={type}
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </MuiButton>
  );
}
