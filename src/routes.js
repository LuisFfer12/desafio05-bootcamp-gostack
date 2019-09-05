import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Repository from './pages/Repository/index';
import Main from './pages/Main/index';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/repository" exact component={Repository} />
      </Switch>
    </BrowserRouter>
  );
}
