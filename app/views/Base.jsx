import React from 'react';
import { Link, RouteHandler } from 'react-router';

export default class BaseView extends React.Component {
  render () {
    return (
      <div>
        <h1>Base</h1>
        <div>
          <Link to="home">Home</Link>
          <a> | </a>
          <a href="/news">News</a>
          <a> | </a>
          <a href="/not-found">Not Found</a>
        </div>
        <RouteHandler />
      </div>
    );
  }
}
