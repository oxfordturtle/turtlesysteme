module.exports = {
  module: {
    rules: [
      {
        test: /\.tg(b|p|y|x)$/,
        use: 'raw-loader'
      }
    ]
  }
}
