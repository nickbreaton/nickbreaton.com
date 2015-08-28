import express from 'express';
import React from 'react';
import Router from 'react-router';

import routes from './app/router';

// create express server
let server = express();

// translate environmental variables
let env = process.env.NODE_ENV;

// define local variables
let port = process.env.PORT || 3000;
let production = (env == 'production');

// serve minified files for production
server.use('/assets/', express.static('build'));

// serve all files in public folder
server.use('/', express.static('public'));

// serve react app as default route
server.use((req, res) => {
  // render react app at correct path
  Router.run(routes, req.originalUrl, (Handler) => {
    // determine developer environment variables
    let app = production ? React.renderToString(<Handler />) : '';
    let host = production ? '' : 'http://localhost:8080';

    // render page
    res.render('index.ejs', { app, host });
  });
});

// create the server on specified port
server.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`)
});
