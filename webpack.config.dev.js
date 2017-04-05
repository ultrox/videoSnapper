var path = require('path')
var webpack = require('webpack')

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'demo'),
		filename: 'app.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			'Promise': 'exports?global.Promise!es6-promise',
			'window.fetch': 'exports?self.fetch!whatwg-fetch'
		}),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			include: [
				path.join(__dirname, 'src'),
				path.join(__dirname, 'test', 'karma')
			]
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.scss$/,
			loader: 'style!css?sourceMap!sass?sourceMap',
			include: path.join(__dirname, 'src')
		}, {
			test: /\.css$/,
			loader: 'style?insertAt=top!css'
		}, {
			test: /\.(jpg|png|mp4)$/,
			loader: 'file-loader',
			options: {
				name: '[path][name].[hash].[ext]',
			},
		},
		]
	}
}
