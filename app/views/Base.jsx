import React from 'react';
import { Link, RouteHandler } from 'react-router';

export default class BaseView extends React.Component {
  render () {
    return (
      <div>
        <h1>Base</h1>
        <div>
          <Link to="home">Home</Link><a> | </a>
          <Link to="news">News</Link><a> | </a>
          <Link to="/random">Random</Link>
        </div>
        <RouteHandler />
      </div>
    );
  }
}
