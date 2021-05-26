import React from 'react';
import { AuthenticationProvider } from '../../../stores/Authentication';

import App from './App';

export default function AppContainer(): JSX.Element {
  return (
    <AuthenticationProvider>
      <App />
    </AuthenticationProvider>
  );
}
