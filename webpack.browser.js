const path = require('path')

module.exports = function (env, argv) {
  return {
    entry: './src/browser/index.js',
    // devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'browser')
    },
    output: {
      filename: 'TurtleSystemE.js',
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
}
