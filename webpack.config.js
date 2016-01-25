var entry = './src/app/main.js',
  output = {
    path: __dirname,
    filename: 'main.js',
    node: {
      fs: "empty"
    }
  };

module.exports.development = {
    debug : true,
    devtool : 'eval',
    entry: entry,
    output: output,
    node: {
        fs: "empty"
    },
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
    }
};

module.exports.production = {
    debug: false,
    entry: entry,
    output: output,
    node: {
        fs: "empty"
    },
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.hbs$/, loader: 'handlebars-loader' }
        ]
    }
};