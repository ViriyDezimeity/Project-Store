import React from 'react';
import { DepartmentsProvider } from '../../../stores/Departments';

import Registration from './Registration';

export default function RegistrationContainer(): JSX.Element {
  return (
    <DepartmentsProvider>
      <Registration />
    </DepartmentsProvider>
  );
}
