const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: '🐱🚀🎹 SPACE: Playful Adventures of Cat Emojis 🎹🚀🐱',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        removeComments: true,
      },
    }),
  ],
  output: {
    filename: 'space-cat-[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            properties: {
              keep_quoted: true,
            },
          },
          compress: {
            booleans_as_integers: true,
            drop_console: true,
          },
        },
      }),
    ],
  },
};
