const path = require('path');

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
  module: {
    rules: [
      {
        test: /\.tg[bpy]$/,
        use: ['raw-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
