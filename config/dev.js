import path from 'path';
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from './webpack'

// add development scripts to configuration
config.entry.push(
  'webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/only-dev-server'
);

// add development plugins to configuration
config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

// add sass compilation
config.module.loaders.push({
  test: /\.scss?$/,
  include: path.join(__dirname, '..', 'styles'),
  loaders: ['style', 'css', 'sass']
});

// create webpack server
let server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  quiet: true
})

// start webpack server
server.listen(8080, (err) => {
  if (err) console.log(err);
});
