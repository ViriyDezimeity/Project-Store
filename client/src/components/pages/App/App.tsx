import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../helpers/useStore';
import { AuthenticationContext } from '../../../stores/Authentication';
import NavBar from '../../molecules/NavBar';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

const App = observer(() => {
  const { userData, isUserAuthorized, logout } = useStore(
    AuthenticationContext
  );

  return (
    <BrowserRouter>
      <CssBaseline />

      <NavBar userData={userData} isUserAuthorized={isUserAuthorized} logout={logout} />
    </BrowserRouter>
  );
})

export default App;
