const path = require('path');

module.exports = {
  entry: './src/browser.js',
  devServer: {
    contentBase: './dist/browser',
    port: 8080
  },
  output: {
    filename: 'tsx.js',
    path: path.resolve(__dirname, 'dist/browser')
  },
  target: 'web',
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
};
