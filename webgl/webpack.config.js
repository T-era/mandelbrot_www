module.exports = {
	mode: 'development',
	//target: 'webworker',
	entry: './src/mandelbrot.ts',
	devtool: 'source-map',
	output: {
		path: __dirname + '/out/',
		filename: './mandelbrot.js'
	},
	module: {
		rules: [
			{ test: /¥*.ts$/, loader: 'ts-loader' }
		]
	},
	resolve: {
		extensions: [ '.ts', '.js' ]
	}
}
