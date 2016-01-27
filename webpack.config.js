const path = require( 'path' );
const node_modules = path.resolve( __dirname, 'node_modules' );
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpack = require( "webpack" );

const PATHS = {
	app: path.resolve(__dirname, 'src/main.js' ),
	build: path.resolve(__dirname, 'build' )
};

module.exports = {

	entry: [ 'webpack/hot/dev-server', PATHS.app ],

	output: {
		path: PATHS.build,
		filename: 'bundle.js',
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel', // 'babel-loader' is also a legal name to reference
				query: {
					presets: [ 'react', 'es2015' ]
				}
			},

			// BOOTSTRAP && OUR FONTS
			{ test: /\.(ttf|eot|svg|woff|woff2?)(\?[a-z0-9]+)?$/, loader : 'file-loader' },

			{ test: /\.(ttf|eot|svg|woff|woff2)?$/, loader : 'file-loader' },

			{ test: /\.eot(\?-[a-z0-9]+)?$/, loader: "file" }, 

			// FONT AWESOME FONTS
			{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" }, 

			{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" }, 

			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" }, 

			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" }, 

			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },

			// IMAGES
			{ test: /\.(png|jpg)$/, loader: 'url?limit=25000' },

			// LESS
            { test: /\.less$/, loader: "style!css!less" },

			// SASS
			{ test: /\.scss$/, loader: 'style!css!sass'	}
		]
	},

	plugins: [
		new OpenBrowserPlugin({ url: 'http://localhost:5000' })
	]
	
};