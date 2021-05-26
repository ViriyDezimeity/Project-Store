import React from 'react';
import { ProjectsProvider } from '../../../stores/Projects';

import Registration from './AddProject';

export default function AddProjectContainer(): JSX.Element {
  return (
    <ProjectsProvider>
      <Registration />
    </ProjectsProvider>
  );
}
