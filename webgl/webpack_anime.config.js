module.exports = {
	mode: 'development',
	//target: 'webworker',
	entry: './src/mandelbrot_anime.ts',
	devtool: 'source-map',
	output: {
		path: __dirname + '/out_anime/',
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
