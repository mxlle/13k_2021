const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: '🐱🚀🎹 SPACE: Playful Adventures of Cat Emojis 🎹🚀🐱',
      template: './src/index.html',
    }),
  ],
  output: {
    filename: 'space-cat.js',
    path: path.resolve(__dirname, 'out'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    static: './out',
  },
};
