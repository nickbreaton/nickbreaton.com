import webpack from 'webpack'
import config from './webpack'

// ready files for production
config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin()
);

// run webpack configuration to build production ready application
webpack(config, (err) => {
  err ? console.log(err) : console.log('Done.');
});
