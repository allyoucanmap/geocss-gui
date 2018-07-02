/* copyright 2018, stefano bovio @allyoucanmap. */

/* eslint-disable no-console */

const application = require('./server');
const config = require("../webpack.config.js");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const compiler = webpack(config);

application(3000, (app) => {
    app.use(webpackDevMiddleware(compiler, {
        hot: true,
        filename: 'geocss-gui.js',
        publicPath: 'http://localhost:3000/dist/',
        stats: {
            colors: true
        },
        historyApiFallback: true
    }));
    
    app.use(webpackHotMiddleware(compiler, {
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
});
