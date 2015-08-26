import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'

module.exports = {
  entry: [
    './app/router',
    './styles/main'
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '..', 'build'),
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
        test: /\.jsx?$/,
        include: path.join(__dirname, '..', 'app'),
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss?$/,
        include: path.join(__dirname, '..', 'styles'),
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  }
}
