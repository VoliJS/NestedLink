var webpack = require( 'webpack' ),
    path = require( 'path' );

    console.log( __dirname );

module.exports = {
    entry  : {
        main : './example/src/databinding.jsx',
        users : './example/src/userslist.jsx',
        asaf : './example/src/asaf.jsx',
    },
    output : {
        path       : path.resolve( __dirname, 'dist' ),
        publicPath : '/dist',
        filename   : '[name].js'
    },

    devtool : 'source-map',

    resolve : {
        modules : [ '.', '../node_modules' ],
        alias : {
            valuelink : path.resolve( __dirname, '../lib' )
        }
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