import React from 'react';
import { ProjectsProvider } from '../../../stores/Projects';

import Projects from './Projects';

export default function ProjectsContainer(): JSX.Element {
  return (
    <ProjectsProvider>
      <Projects />
    </ProjectsProvider>
  );
}
