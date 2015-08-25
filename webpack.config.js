var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080/assets/',
    'webpack/hot/only-dev-server',
    './app/router',
    './styles/main'
  ],
  output: {
    filename: 'bundle.js',
    path: './build/',
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
