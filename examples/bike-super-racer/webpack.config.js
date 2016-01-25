var path = require('path');
var webpack = require('webpack');

var rpmMeterSrc = path.join(__dirname, '..', '..', 'src');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/,
				include: [
					__dirname,
					rpmMeterSrc
				]
			}
		]
	},
	resolve: {
		alias: {
			'spin-bike-rpm-meter': rpmMeterSrc
		}
	}

};