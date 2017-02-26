const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const path = require('path')
const postcssImport = require('postcss-import')

// plugins
plugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'main',
		children: true,
		minChunks: 2
	}),

	// Cleanup the builds/ folder before
	// compiling our final assets
	new CleanPlugin('builds'),

	// This plugin looks for similar chunks and files
	// and merges them for better caching by the user
	new webpack.optimize.DedupePlugin(),

	// This plugin prevents Webpack from creating chunks
	// that would be too small to be worth loading separately
	new webpack.optimize.MinChunkSizePlugin({
		minChunkSize: 51200, // ~50kb
	}),

	// This plugins defines various variables that we can set to false
	// in production to avoid code related to them from being compiled
	// in our final bundle
	new webpack.DefinePlugin({
		__SERVER__: false,
		__DEVELOPMENT__: false,
		__DEVTOOLS__: false,
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
]

module.exports = {
	debug: false,
	entry: {
		app: [
			'./src/client.jsx',
		],
		vendor: ['react', 'react-dom', 'draft-js'],
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loaders: ['react-hot', 'babel'],
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
		},{
			test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			loader: 'file-loader'
		},{
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
		path: __dirname + '/dist/assets/',
		publicPath: '/assets/',
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js',
	},
	plugins: plugins,
	devtool: false,
}
