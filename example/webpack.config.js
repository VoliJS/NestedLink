var webpack = require( 'webpack' );

module.exports = {
    entry  : {
        main : './example/src/databinding.jsx',
        users : './example/src/userslist.jsx',
        asaf : './example/src/asaf.jsx',
    },
    output : {
        path       : __dirname,
        publicPath : '/dist',
        filename   : '[name].js'
    },

    devtool : 'source-map',

    resolve : {
        modules : [ '.', '../node_modules' ],
        alias : {
            valuelink : __dirname + '/lib/index.js',
            'valuelink/tags' : './tags.js'
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
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
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