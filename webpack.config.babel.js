import path from 'path'

export default {
  mode: process.env.NODE_ENV || 'production',
  entry: [
    './assets/js/barefoot.js',
    './assets/js/copy.js',
    './assets/js/filter-sort.js',
    './assets/js/ui.js',
    './assets/js/lazy.js',
  ],
  output: {
    path: path.resolve(__dirname, 'assets', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  }
}
