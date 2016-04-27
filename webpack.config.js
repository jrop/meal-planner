'use strict'

const path = require('path')
const webpack = require('webpack')

const prod = process.env.NODE_ENV == 'production'

module.exports = {
	entry: './src/index.js',
	output: {
		path: './build',
		filename: 'index.js',
	},
	devtool: prod ? null : 'source-map',
	module: {
		loaders: [ {
			test: /\.jsx?$/,
			include: [ path.resolve(__dirname, 'src') ],
			loader: 'babel',
		}, {
			test: /\.less$/,
			loader: 'style-loader!css-loader!less-loader',
		} ],
	},
	plugins: prod ? [ new webpack.optimize.UglifyJsPlugin({
		comments: false,
		compress: {
			dead_code: true,
			warnings: false,
		},
		mangle: true,
	}) ] : [ ],
}
