const builder = require('webpack-configify').default

const prod = process.env.NODE_ENV == 'production'

module.exports = builder()
	.production(prod)
	.development(!prod)
	.src('./src/index.js')
	.dest('./build', false)
	.loader('.js', 'babel-loader')
	.merge({output: {publicPath: '/build/'}})
	.build()

if (require.main === module)
	// eslint-disable-next-line no-console
	console.log(require('util').inspect(module.exports, null, null))
