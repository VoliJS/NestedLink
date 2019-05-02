var webpack = require( 'webpack' ),
    path = require( 'path' );

    console.log( __dirname );

module.exports = {
    entry  : './src/index.jsx',
    output : {
        path       : path.resolve( __dirname, 'dist' ),
        publicPath : '/dist',
        filename   : '[name].js'
    },

    devtool : 'source-map',

    resolve : {
        modules : [ './node_modules' ],
    },

    module : {
        rules : [
            {
                test : /\.css$/,
                use : [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test    : /\.jsx?$/,
                exclude : /(node_modules|lib)/,
                loader  : 'babel-loader'
            }
        ]
    }
};