module.exports = {
	// entry: 'String | [String] | {}', // can be empty and load entry later from plugins
	entry: {
		server: './source/server/**/*.js',
		web: [
			'./source/web/templates/**/*.js',
			'./source/web/components/**/*.js',
			'./source/web/lib/**/*.js'
		]
	},
	ouput: {
		filename: 'index.js',
		path: __dirname + '/dist/[name].bundle.js'
	},
	/* loaders */
	module: {
		rules: [
			{ test: /\\.css$/, use: [{loader: 'style-loader' }, {loader: 'sass-loader' }] },
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use:  {
					loader: 'webpack-concat-files',
					files: ['[name].js', '[name.jsx']
				},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		]
	},
	plugins: {

	},
	config: {},
	modules: [],
	dependency: {},
	targets: []
};

