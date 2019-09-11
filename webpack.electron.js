module.exports = {
  module: {
    rules: [
      {
        test: /\.t(bas|pas|py|gx)$/,
        use: 'raw-loader'
      }
    ]
  }
}
