var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: './static/js/base.js',

  output: {
      path: path.resolve('./static/bundles/'),
      filename: "[name]-[hash].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: ['babel-loader',]},
      { test: /\.jsx$/, exclude: /node_modules/, loader: ['babel-loader',]}, // to transform JSX into JS
    ],
  },

}