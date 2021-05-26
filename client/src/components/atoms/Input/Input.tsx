import React from 'react';
import { TextField } from '@material-ui/core';

interface InputProps {
  name: string;
  label: string;
  value: string;
  error: any;
  multiline?: boolean;
  onChange: (event: React.SyntheticEvent) => void;
}

export default function Input({
  name,
  label,
  value,
  error = null,
  onChange,
  multiline = false,
  ...other
}: InputProps): JSX.Element {
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      multiline={multiline}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
