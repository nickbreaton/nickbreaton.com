import React from 'react';
import Router, { Route } from 'react-router';

import BaseView from './views/Base';
import HomeView from './views/Home';
import NewsView from './views/News';

let routes = (
  <Route handler={ BaseView } name="base" path="/">
    <Route handler={ HomeView } name="home" path="/" />
    <Route handler={ NewsView } name="news" />
    <Router.NotFoundRoute />
  </Route>
);

if (typeof document !== 'undefined') {
  Router.run(routes, Router.HistoryLocation, (Handler) => {
    React.render(<Handler />, document.getElementById('app'));
  });
}

export default routes;
