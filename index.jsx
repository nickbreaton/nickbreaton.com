import express from 'express';
import React from 'react';

import routes from './app/router';

// create express server
let server = express();

// translate environmental variables
let env = process.env.NODE_ENV;
let production = (env == 'production');
let development = (env == 'development');

// define local variables
let port = 3000;

// define server routes
server.use(function (req, res) {
  res.render('index.ejs', { development, production });
});

// create the server on specified port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
