import path from 'path';

export default {
  entry: [
    './app/router',
    './styles/main'
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '..', 'build'),
    publicPath: 'http://localhost:8080/assets/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '..', 'app'),
        loaders: ['react-hot', 'babel']
      }
    ]
  }
}
