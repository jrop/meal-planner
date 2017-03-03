const builder = require('webpack-configify').default

const prod = process.env.NODE_ENV == 'production'

module.exports = builder()
	.production(prod)
	.development(!prod)

	.src('./src/index.js')
	.dest('./build', '/build/')
	.merge({
		module: {
			loaders: [{
				test: /\.js/,
				include: [`${__dirname}/src`],
				loader: 'babel-loader',
			}],
		},
	})
	.build()
