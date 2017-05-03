const manifest = require('../manifest.json');
const glue = require('glue');
const options = { relativeTo: __dirname };
const url = 'mongodb://localhost:27017/';
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

config.start(url).then(() => {
    glue.compose(manifest, options, glueCallback);
}).catch(err => {
    console.error(err);
});