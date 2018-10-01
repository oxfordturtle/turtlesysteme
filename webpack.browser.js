const path = require('path')

module.exports = {
  entry: {
    main: './src/browser-main.js',
    help: './src/browser-help.js',
    about: './src/browser-about.js'
  },
  devServer: {
    contentBase: './dist',
    port: 8080
  },
  output: {
    filename: 'js/tsx-browser-[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'web',
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
