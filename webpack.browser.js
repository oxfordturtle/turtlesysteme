const path = require('path')

module.exports = {
  entry: {
    app: './src/browser/index.js',
    about: './src/browser/about.js',
    help: './src/browser/help.js',
    system: './src/browser/system.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'browser')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'browser')
  },
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'src/common/')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.tg(b|p|y|x)$/,
        use: 'raw-loader'
      }
    ]
  }
}
