module.exports = {
	mode: 'development',
	target: 'webworker',
	entry: './src/js/web_worker.js',
	devtool: 'source-map',
	output: {
		path: __dirname + '/out/',
		filename: './mandelbrot_www.js'
	},
	module: {
		rules: [
			{ test: /¥.ts#/, loader: 'ts-loader' }
		]
	},
	resolve: {
		extensions: [ '.ts', '.js' ]
	}
}
