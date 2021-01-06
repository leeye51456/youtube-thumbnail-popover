const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const getZipFileName = () => {
  const manifest = require('./public/manifest.json');
  const name = manifest.name.toLowerCase().replace(/\s/g, '-');
  const version = manifest.version.replace(/\./g, '_');
  return `${name}-${version}.zip`;
};

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: './' },
      ],
    }),

    new ZipPlugin({
      filename: getZipFileName(),
    }),
  ],
};
