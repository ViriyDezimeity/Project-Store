import React, { createContext } from 'react';
import { observer } from 'mobx-react';
import { useLocalObservable } from 'mobx-react-lite';

import { AuthenticationStore } from './Authentication.store';
import Loading from '../../components/atoms/Loading';

export interface ProviderProps {
  children: React.ReactNode;
}

export const AuthenticationContext = createContext<AuthenticationStore | null>(
  null
);

export const AuthenticationProvider = observer(
  ({ children }: ProviderProps) => {
    const store = useLocalObservable(() => new AuthenticationStore());
    const { state } = store;

    return (
      <AuthenticationContext.Provider value={store}>
        {state === 'loading' && <Loading />}
        {state === 'error' &&
          'An error occurred during loading user data, please try again later.'}
        {state === 'loaded' && children}
      </AuthenticationContext.Provider>
    );
  }
);
