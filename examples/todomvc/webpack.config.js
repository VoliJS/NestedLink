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
        modules : [ 'node_modules', 'js', '.' ]
    },

    plugins : [
        new webpack.ProvidePlugin( {
            $          : "jquery",
            jQuery     : 'expose?jQuery!jquery',
            _          : "underscore"
        } )
    ],

    mode : 'development',
    
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
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    }
};
