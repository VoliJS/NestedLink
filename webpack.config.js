var webpack = require( 'webpack' );

module.exports = {
    entry  : './example/main.jsx',
    output : {
        path       : __dirname,
        publicPath : '/',
        filename   : 'app.js'
    },

    devtool : 'source-map',

    resolve : {
        modulesDirectories : [ 'example', '.', 'node_modules' ]
    },

    module : {
        loaders : [
            {
                test    : /\.jsx?$/,
                exclude : /(node_modules)/,
                loader  : 'babel?optional[]=runtime'
            },

            { test : /\.css$/, loader : "style-loader!css-loader" }
        ]
    }
};
