import React from 'react';  
import { SnackbarProvider } from 'notistack';
import { AuthenticationProvider } from '../../../stores/Authentication';

import App from './App';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function AppContainer(): JSX.Element {
  return (
    <AuthenticationProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <App />
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </AuthenticationProvider>
  );
}
