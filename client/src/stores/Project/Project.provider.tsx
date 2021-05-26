import React, { createContext } from 'react';
import { observer } from 'mobx-react';
import { useLocalObservable } from 'mobx-react-lite';

import { ProjectStore } from './Project.store';
import Loading from '../../components/atoms/Loading';

export interface ProviderProps {
  id: string;
  children: React.ReactNode;
}

export const ProjectContext = createContext<ProjectStore | null>(
  null
);

export const ProjectProvider = observer(
  ({ id, children }: ProviderProps) => {
    const store = useLocalObservable(() => new ProjectStore());
    const { state } = store;

    store.setProjectId(id)

    return (
      <ProjectContext.Provider value={store}>
        {state === 'loading' && <Loading />}
        {state === 'error' &&
          'An error occurred during loading user data, please try again later.'}
        {state === 'loaded' && children}
      </ProjectContext.Provider>
    );
  }
);
