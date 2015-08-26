import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

import config from './webpack';

// ready files for production
config.plugins = [
  new ExtractTextPlugin('bundle.css'),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin()
];

// extract css for quicker page load
config.module.loaders.push({
  test: /\.scss?$/,
  include: path.join(__dirname, '..', 'styles'),
  loader: ExtractTextPlugin.extract('style', 'css!sass')
});

// run webpack configuration to build production ready application
webpack(config, (err) => {
  err ? console.log(err) : console.log('Done.');
});
