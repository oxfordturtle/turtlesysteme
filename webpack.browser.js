const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    help: './src/help.js',
    about: './src/about.js'
  },
  devServer: {
    contentBase: './dist',
    port: 8080
  },
  output: {
    filename: 'js/tsx-[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'web',
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
