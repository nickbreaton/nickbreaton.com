import React from 'react';
import { RouteHandler } from 'react-router';

export default React.createClass({
  getInitialState () {
    return { count: 0 }
  },

  _click () {
    this.setState({ count: this.state.count + 1 })
  },

  render () {
    return (
      <div>
        <button onClick={ this._click }>Click</button>
        <h4>{ this.state.count }</h4>
      </div>
    );
  }
});
