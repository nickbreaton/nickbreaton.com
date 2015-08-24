import React from 'react';
import { RouteHandler } from 'react-router';

export default class BaseView extends React.Component {
  render () {
    return (
      <div>
        <h1>Base</h1>
        <RouteHandler />
      </div>
    );
  }
}
