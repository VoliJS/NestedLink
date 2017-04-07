var webpack = require( 'webpack' );

module.exports = {
    entry  : {
        main : './example/main.jsx',
        users : './example/userslist.jsx',
        asaf : './example/asaf.jsx',
    },
    output : {
        path       : __dirname + '/example',
        publicPath : '/',
        filename   : '[name].app.js'
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
