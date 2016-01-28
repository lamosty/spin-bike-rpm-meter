'use strict';

var webpack = require('webpack');
var WebpackStrip = require('strip-loader');

var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);

config.module.loaders.push({
	test: /\.js$/,
	loader: WebpackStrip.loader('debug')
});

config.plugins = [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('production')
	}),
	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			screw_ie8: true,
			warnings: false
		}
	})
];

module.exports = config;

