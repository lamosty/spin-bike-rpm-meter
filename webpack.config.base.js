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
		library: 'SpinBikeRpmMeter',
		libraryTarget: 'umd'
	}
};