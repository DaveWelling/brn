const manifest = require('../manifest.json');
const glue = require('glue');
const options = { relativeTo: __dirname };
const config = require('./config');

const glueCallback = function(err, server) {
    if (err) {
        // noinspection Eslint
        console.error(err);
    }
    server.settings.debug.log.push('error');
    server.settings.debug.request.push('error', 'api');
    server.start(function() {
        // noinspection Eslint
        console.log('Server running at: ', server.info.uri);
    });
};


glue.compose(manifest, options, glueCallback);