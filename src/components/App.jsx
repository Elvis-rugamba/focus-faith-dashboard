
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Dashboard from './Dashboard.jsx';
import UsersTable from './Users.jsx';

import AuthFile from '../auth/AuthFile.jsx'
import { PrivateRoute } from "../auth/ProtectedRoute.jsx";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={AuthFile} />
        <PrivateRoute path="/"  component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;