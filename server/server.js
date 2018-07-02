/* copyright 2018, stefano bovio @allyoucanmap. */

/* eslint-disable no-console */

const express = require("express");
const path = require('path');
const app = express();
// const proxy = require('express-http-proxy');

const application = (port = 3000, before = () => {}) => {

    before(app);

    app.use(express.static('./'));

    // app.use('/', proxy('http://localhost:8080/geoserver'));

    app.use(`http://localhost:${port}/`, function (req, res) {
        res.sendFile(path.resolve('./index.html'));
    });

    app.listen(port, function (error) {
        if (error) throw error;
        console.warn("Express server listening on port", port);
    });
};

module.exports = application;
