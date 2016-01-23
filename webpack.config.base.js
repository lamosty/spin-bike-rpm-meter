'use strict';

module.exports = {
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				},
				exclude: /node_modules/
			}
		]
	},
	output: {
		library: 'Spin-bike RPM Meter',
		libraryTarget: 'umd'
	}
};