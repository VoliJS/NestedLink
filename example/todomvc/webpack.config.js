var webpack = require( 'webpack' );

module.exports = {
    entry  : './js/main.jsx',
    output : {
        // export itself to a global var
        path       : __dirname,
        publicPath : '/',
        filename   : 'app.js'
    },

    devtool : 'source-map',

    resolve : {
        modulesDirectories : [ 'node_modules', 'js', '' ]
    },

    plugins : [
        new webpack.ProvidePlugin( {
            $          : "jquery",
            jQuery     : 'expose?jQuery!jquery',
            _          : "underscore"
        } )
    ],

    module : {
        loaders : [
            {
                test    : /\.js$/,
                exclude : /(node_modules)/,
                loader  : 'babel?optional[]=runtime'
            },

            {
                test    : /\.jsx$/,
                loader  : 'babel?optional[]=runtime'
            },

            { test : /\.css$/, loader : "style-loader!css-loader" }
        ]
    }
};
