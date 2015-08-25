var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var config = {
  entry: [
    './app/router',
    './styles/main'
  ],
  output: {
    filename: 'bundle.js',
    path: './build/',
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: /app/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss$/,
        include: /styles/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  }
}

// add development scripts if not building
if (process.env.NODE_ENV !== 'build') {
  config.entry.push(
    'webpack-dev-server/client?http://localhost:8080/assets/',
    'webpack/hot/only-dev-server'
  );
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}

module.exports = config;
