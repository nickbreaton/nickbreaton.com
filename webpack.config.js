var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080/assets/',
    'webpack/hot/only-dev-server',
    './app/router'
  ],
  output: {
    filename: 'bundle.js',
    path: './build/',
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx$/, include: /app/, loaders: ['react-hot', 'babel'] }
    ]
  }
}
