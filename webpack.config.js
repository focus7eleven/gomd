const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const path = require('path')
const postcssImport = require('postcss-import')

plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new ExtractPlugin('bundle.css'),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'main',
		children: true,
		minChunks: 2
	}),
]

module.exports = {
	debug: true,
	entry: {
		app: [
			'webpack-dev-server/client?http://localhost:8082',
			'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
			'./src/client.jsx',
		],
		vendor: ['react', 'react-dom', 'draft-js'],
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: [/node_modules/,path.resolve('./src/utils/ueditor')],
			loaders: ['react-hot', 'babel'],
		},{
			test: /\.jsx?$/,
			include:[path.resolve('./src/utils/ueditor')],
			loaders: ['babel'],
		}, {
			test: /\.scss$/,
			loaders: ["style", 'css?modules&importLoaders=1' +
        '&localIdentName=[name]__[local]___[hash:base64:5]!postcss', "sass"]
		},{
			test: /\.css$/,
			loaders: ["style", "css"],
		}, {
			test: /\.(jpe?g|png|gif)$/i,
			loaders: [
				'file?hash=sha512&digest=hex&name=[hash].[ext]',
				'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
			]
		}, {
			test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			loader: 'file-loader'
		}, {
			test: /(\.swf$|\.xap$)/,
			loader: 'file-loader'
		}],
	},
	postcss: function() {
		return [
			postcssImport({
				addDependencyTo: webpack,
			}), autoprefixer, precss
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		root: [
			path.resolve('./sass_modules/'),
			path.resolve('./src/utils/'),
			path.resolve('./src/public/'),
		]
	},
	output: {
		path: __dirname + '/dist',
		publicPath: '/assets/',
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js',
	},
	devServer: {
		hot: true,
		contentBase: './dist',
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		historyApiFallback: true
	},
	plugins: plugins,
	devtool: 'sourcemap',
}
