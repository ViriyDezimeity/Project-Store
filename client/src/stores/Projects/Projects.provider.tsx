import React, { createContext } from 'react';
import { observer } from 'mobx-react';
import { useLocalObservable } from 'mobx-react-lite';

import { ProjectsStore } from './Projects.store';
import Loading from '../../components/atoms/Loading';

export interface ProviderProps {
  children: React.ReactNode;
}

export const ProjectsContext = createContext<ProjectsStore | null>(
  null
);

export const ProjectsProvider = observer(
  ({ children }: ProviderProps) => {
    const store = useLocalObservable(() => new ProjectsStore());
    const { state } = store;

    return (
      <ProjectsContext.Provider value={store}>
        {state === 'loading' && <Loading />}
        {state === 'error' &&
          'An error occurred during loading user data, please try again later.'}
        {state === 'loaded' && children}
      </ProjectsContext.Provider>
    );
  }
);
