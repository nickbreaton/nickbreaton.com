import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from './webpack'

// add development scripts to configuration
config.entry.push(
  'webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/only-dev-server'
);

// add development plugins to configuration
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

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
