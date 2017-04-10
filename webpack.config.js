module.exports = {
    entry : "./lib/index.js",

    output : {
        filename      : './dist/index.js',
        library       : "NestedLink",
        libraryTarget : 'umd'
    },

    devtool : 'source-map',

    resolve : {
        extensions : [ '.ts', '.js' ] 
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            },
            {
                enforce : "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ],
    }
};
