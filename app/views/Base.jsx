import React from 'react';
import { RouteHandler } from 'react-router';

export default class BaseView extends React.Component {
  render () {
    return (
      <div>
        <h1>Base</h1>
        <div>
          <a href="/">Home</a>
          <a> | </a>
          <a href="/news">News</a>
        </div>
        <RouteHandler />
      </div>
    );
  }
}
