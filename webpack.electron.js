const path = require('path')

module.exports = {
  entry: './src/electron.js',
  devServer: {
    contentBase: './dist/electron',
    port: 9000
  },
  output: {
    filename: 'tsx.js',
    path: path.resolve(__dirname, 'dist/electron')
  },
  target: 'electron-renderer',
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.tg[bpy]$/,
        use: ['raw-loader']
      }
    ]
  }
}
