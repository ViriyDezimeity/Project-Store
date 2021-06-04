import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ProjectProvider } from '../../../stores/Project';

import Project from './Project';

interface ProjectProps {
  id: string;
}

export default function ProjectContainer({
  match,
}: RouteComponentProps<ProjectProps>): JSX.Element {
  const { id } = match.params;

  return (
    <ProjectProvider id={id} >
      <Project />
    </ProjectProvider>
  );
}
