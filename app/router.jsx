import React from 'react';
import Router, { Route } from 'react-router';

import BaseView from './views/Base';
import HomeView from './views/Home';

let routes = (
  <Route handler={ BaseView } name="base">
    <Route handler={ HomeView } name="home" path="/" />
  </Route>
);

if (typeof document !== 'undefined') {
  Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('app'));
  });
}

// console.log(routes);

export default routes;
