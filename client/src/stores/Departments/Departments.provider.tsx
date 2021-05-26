import React, { createContext } from 'react';
import { observer } from 'mobx-react';
import { useLocalObservable } from 'mobx-react-lite';

import { DepartmentsStore } from './Departments.store';
import Loading from '../../components/atoms/Loading';

export interface ProviderProps {
  children: React.ReactNode;
}

export const DepartmentsContext = createContext<DepartmentsStore | null>(
  null
);

export const DepartmentsProvider = observer(
  ({ children }: ProviderProps) => {
    const store = useLocalObservable(() => new DepartmentsStore());
    const { state } = store;

    return (
      <DepartmentsContext.Provider value={store}>
        {state === 'loading' && <Loading />}
        {state === 'error' &&
          'An error occurred during loading user data, please try again later.'}
        {state === 'loaded' && children}
      </DepartmentsContext.Provider>
    );
  }
);
